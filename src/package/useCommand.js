import { onUnmounted } from "vue";
import { deepCopy } from "./deepcopy";
import { events } from "./event";

export default function useCommand(data){
    const state = {// 前进后退需要指针
        current : -1 ,// 前进后退索引值
        queue:[],//存放操作命令
        commands:{}, // 制作命令和重做功能的映射表 undo = ()=>{} redo = ()=>{}
        commandArray:[],//存放所有命令
        destoryArray:[]// 销毁列表
    }
    const registry = (command) =>{
        state.commandArray.push(command);
        state.commands[command.name] = ()=>{ // 命令名字对应执行函数
            const {redo,undo} = command.execute();
            redo();
            if(!command.pushQueue){// 不需要放到队列直接跳过
                return ;
            }else {
                let {queue,current} =state;
                // 如果组件1 => 组件2 =>撤销 => 组件3       组件1 => 组件3
                if(queue.length>0){
                    queue =  queue.slice(0,current+1); // 可能在放置的过程中有撤销操作，根据最近的current计算值
                    state.queue =  queue;
                }

                queue.push({redo,undo});// 保存指令的前进后退
                state.current = current + 1;
            }
        }
    }

    registry({
        name:"redo",
        keyboard:"ctrl+y",
        execute(){
            // 存在公共功能
            return {
                redo(){
                    let item = state.queue[state.current+1];//找到当前的下一步还原操作  
                    if(item){
                        item.undo && item.redo();
                        state.current++ ;
                    }
                }
            }
        }
    })
    registry({
        name:"undo",
        keyboard:"ctrl+z",
        execute(){
            return {
                redo(){
                    if(state.current === -1){// 没有可以撤销
                        return ;
                    }
                    let item = state.queue[state.current];
                    if(item){
                        item.undo && item.undo();// 这里没有操作队列
                        state.current-- ;
                    }
                }
            }
        }
    })
    registry({// 如果希望将操作放到队列中增加一个属性标识操作放在队列中
        name:"drag",
        keyboard:"",
        pushQueue:true,
        init(){// 初始化操作默认就会执行
            this.before = null;
            // 监控拖拽开始事件保存状态
            const start = ()=>{
                // console.log("start",data.value.blocks);
                this.before = deepCopy(data.value.blocks)
            };
            // 拖拽之后需要触发对应指令
            const end = ()=>{
                // console.log("end",data.value.blocks);
                state.commands.drag();
            };
            events.on("start",start);
            events.on("end",end);
            return ()=>{// 返回销毁函数
                events.off("start",start);
                events.off("end",end);
            }

        },
        execute(){
            let before = this.before;
            let after = data.value.blocks;// 之后的状态
            return {
                redo(){ // 默认一松手就把当前事情做了
                    data.value = {...data.value,blocks:after}
                },
                undo(){ // 前一步
                    data.value = {...data.value,blocks:before}
                }
            }
        }
    });
    const keyboardEvent = (()=>{
        const keyCodes ={
            90:'z',
            89:"y",
        }
        const onKeydown = (e)=>{
            const {ctrlKey,keyCode} = e;//ctrl+z ctrl+y
            let keyString = [];
            if(ctrlKey) keyString.push("ctrl");
            keyString.push(keyCodes[keyCode]);
            keyString = keyString.join("+");

            state.commandArray.forEach(({keyboard,name})=>{
                if(!keyboard) return ;
                if(keyboard === keyString){
                    state.commands[name]();
                    e.preventDefault(); 
                }
            })
        }
        const init = ()=>{// 初始化
            window.addEventListener('keydown',onKeydown);

            return ()=>{ // 销毁事件
                window.removeEventListener("keydown",onKeydown)
            }
        }
        return init;
    })();
    ;
    (()=>{
        // 监听键盘事件
        state.destoryArray.push(keyboardEvent());
        state.commandArray.forEach(command=>command.init && state.destoryArray.push(command.init()));
    })()

    onUnmounted(()=>{ //  清理绑定事件
        state.destoryArray.forEach(fn=>{
            fn&&fn();
        })
    })
    return state;
}