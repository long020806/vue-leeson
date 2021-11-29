import { defineComponent ,computed,inject,ref} from "vue"
import EditorBlock from "./editor-block";
import {deepCopy} from "../package/deepcopy"
import useMenuDragger from "../package/useMenuDragger";
import useFocus from "../package/useFocus";
import useBlockDrag from "../package/useBlockDrag";
import "./editor.scss";

export default defineComponent({
    components:{
        EditorBlock,
    },
    props:{
        modelValue:{tyoe:Object}
    },
    emits:["update:modelValue"],//触发的事件
    setup(props,ctx){
        const data = computed({
            get(){
                return props.modelValue;
            },
            set(newVal){
                ctx.emit("update:modelValue",deepCopy(newVal));//deepCopy深拷贝(暂未实现)
            }
        })
        const containerStyles = computed(()=>({
            width:data.value.container.width+"px",
            height:data.value.container.height+"px"
        }))
        // console.log(data.value.container.width)
        // console.log(containerStyles)
        const config = inject("config")
        const containerRef = ref(null);
       //实现菜单拖拽功能
       
        const {dragStart,dragEnd} =  useMenuDragger(containerRef,data)
        // 实现获取焦点
        const {containerMousedown,blockMousedown,focusData}= useFocus(data,(e)=>{
            //获取焦点后进行拖拽
            mousedown(e)
        });
        const {mousedown} = useBlockDrag(focusData);



        
        // 实现拖拽多个元素功能
        return ()=>(
            <div class="editor">
                <div class="editor-left">
                    {/* 根据注册列表渲染物料列表 ,可以实现h5拖拽 draggable*/}
                        {
                            config.componentList.map(item=>(
                                
                                <div class="editor-left-item"
                                    draggable
                                    onDragstart={e=>dragStart(e,item)}
                                    onDragEnd = {dragEnd}
                                >
                                    <span>{item.label}</span>                                  
                                    <div>{item.preview()}</div>                                  
                                </div>
                            ))
                        }
                </div>
                <div class="editor-top">菜单栏</div>
                <div class="editor-right">属性控制栏</div>
                <div class="editor-container">
                    {/* 负责产生滚动条 */}
                    <div className="editor-container-canvas">
                        {/* 产生内容区域 */}
                        <div class="editor-container-canvas__content" style={containerStyles.value} ref={containerRef} onMousedown={containerMousedown}>
                            {
                                data.value.blocks.map(item=>(
                                    <EditorBlock class={item.focus?"editor-block-focus":""} onMousedown={e=>{blockMousedown(e,item)}} block={item}></EditorBlock>
                                ))
                            }
                        </div>
                    </div>
                </div>
                
            </div>
        )      
    }
})