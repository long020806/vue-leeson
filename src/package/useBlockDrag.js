export default function useBlockDrag(focusData) {
    let dragState = {
        startX: 0,
        startY: 0
    }
    const mousedown = (e) => {
        dragState = {
            startX: e.clientX,
            startY: e.clientY, //记录每个选中的位置
            startPos: focusData.value.focus.map(({ top, left }) => ({ top, left }))
        }
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup);
    }

    const mousemove = (e) => {
        let { clientX: moveX, clientY: moveY } = e;
        let dx = moveX - dragState.startX;
        let dy = moveY - dragState.startY;
        focusData.value.focus.map((block, idx) => {
            block.top = dragState.startPos[idx].top + dy;
            block.left = dragState.startPos[idx].left + dx;
        })
    }

    const mouseup = (e) => {
        document.removeEventListener("mousemove", mousemove)
        document.removeEventListener("mouseup", mouseup);
    }
    return {
        mousedown
    }
}