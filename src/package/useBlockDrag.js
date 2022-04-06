import {reactive} from "vue";
import {events} from "./event"
export default function useBlockDrag(focusData,lastSelectBlock,data) {
    let dragState = {
        startX: 0,
        startY: 0,
        dragging:false// 默认不是正在拖拽
    }
    let markLine = reactive({
        x:null,
        y:null
    })
    const mousedown = (e) => {
        // B 拖动元素 A其他未元素
        const {width:BWidth,height:BHeight} = lastSelectBlock.value; 

        dragState = {
            startX: e.clientX,
            startY: e.clientY, //记录每个选中的位置
            startLeft: lastSelectBlock.value.left,// b拖拽前left
            startTop: lastSelectBlock.value.top,// b拖拽前top
            dragging:false,
            startPos: focusData.value.focus.map(({ top, left }) => ({ top, left })),
            lines:(()=>{
                const {unfocused} = focusData.value; // 获取其他没选中的元素做辅助线
                let lines = {x:[],y:[]}; //计算横线位置用y 竖线位置用x
                [...unfocused,{// 添加整个拖动框元素
                    top:0,left:0,width:data.value.container.width,height:data.value.container.height
                }].forEach(block => {
                    const {top:ATop,left:ALeft,width:AWidth,height:AHeight} = block;
                    
                    // 当此B元素拖拽到 top一致时，显示辅助线，辅助线的位置就是ATop   
                    lines.y.push({showTop:ATop,top:ATop}) // A顶 对 B顶
                    lines.y.push({showTop:ATop,top:ATop - BHeight}) // A顶 对 B底 
                    lines.y.push({showTop:ATop + AHeight/2,top:ATop + AHeight/2 - BHeight/2}) // A中 对 B中 
                    lines.y.push({showTop:ATop + AHeight,top:ATop + AHeight}) // A底 对 B顶 
                    lines.y.push({showTop:ATop + AHeight,top:ATop + AHeight - BHeight}) // A底 对 B底


                    lines.x.push({showLeft:ALeft,left:ALeft})//A左 对 B左
                    lines.x.push({showLeft:ALeft + AWidth,left:ALeft + AWidth})//A右 对 B左
                    lines.x.push({showLeft:ALeft + AWidth/2,left:ALeft + AWidth/2 - BWidth/2})//A中 对 B中
                    lines.x.push({showLeft:ALeft + AWidth,left:ALeft + AWidth - BWidth})//A右 对 B右
                    lines.x.push({showLeft:ALeft,left:ALeft - BWidth})//A左 对 B右
                });
                return lines;
            })(),
        }
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup);
    }

    const mousemove = (e) => {
        let { clientX: moveX, clientY: moveY } = e;
            if(!dragState.dragging){
                dragState.dragging = true;
                events.emit("start");// 触发记住之前位置
            }

        // 计算当前元素最新的top和left
        // 鼠标移动后 - 鼠标移动前 + left or top
        let left = moveX - dragState.startX + dragState.startLeft; 
        let top = moveY - dragState.startY + dragState.startTop;
        // 最新的left和top 和lines中的x,y的left，top对比一致(距离5px)则需要绘制辅助线
        let y = null;// 横线显示位置
        let x = null; //竖线产生的位置
        for(let i =0 ;i<dragState.lines.y.length;i++){
            const {top:t,showTop:s} = dragState.lines.y[i]; // 获取每一根线
            if(Math.abs(t-top) < 5){
                y = s;
                moveY = dragState.startY - dragState.startTop + t;//容器距离顶部的距离 + 目标高度就是最新的move
                // 实现快速贴边
                
                break; //找到一根线后跳出
            }
        }
        for(let i =0 ;i<dragState.lines.x.length;i++){
            const {left:l,showLeft:s} = dragState.lines.x[i]; // 获取每一根线
            if(Math.abs(l-left) < 5){
                x = s;
                moveX = dragState.startX - dragState.startLeft + l;//容器距离左侧的距离 + 目标左侧就是最新的move
                // 实现快速贴边
                
                break; //找到一根线后跳出
            }
        }

        markLine.x = x;// 如果markLine是一个响应式数据 x,y更新导致视图更新
        markLine.y = y;

        let dx = moveX - dragState.startX;// 拖拽前后距离
        let dy = moveY - dragState.startY; 

        focusData.value.focus.map((block, idx) => {
            block.top = dragState.startPos[idx].top + dy;
            block.left = dragState.startPos[idx].left + dx;
        })
    }

    const mouseup = (e) => {
        document.removeEventListener("mousemove", mousemove)
        document.removeEventListener("mouseup", mouseup);
        markLine.x = null;
        markLine.y = null;
        if(dragState.dragging){
            // 如果只是点击不会触发
            events.emit("end");// 触发记住之前位置
        }
    }
    return {
        mousedown,
        markLine
    }
}