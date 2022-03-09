export default function useMenuDragger(containerRef, data ) {
    let currentCompoent = null;
    const dragenter = (e) => {
        e.dataTransfer.dropEffect = "move"; //h5拖动图标
    }
    const dragover = (e) => {
        e.preventDefault();
    }
    const dragleave = (e) => {
        e.dataTransfer.dropEffect = "none"
    }
    const drop = (e) => {
        const blocks = data.value.blocks;
        data.value = {...data.value,
            blocks: [...blocks, {
                top: e.offsetY,
                left: e.offsetX,
                zIndex: 1,
                key: currentCompoent.key,
                alignCenter: true, //drop时居中
            }]
        };
        currentCompoent = null;

    }
    const dragStart = (e, compoent) => {
        //dragenter进入元素中，进入时添加一个移动标识
        //dragover在目标元素经过，必须阻止默认行为，否则不触发drop
        //dragleave 离开目标元素，增加一个禁用标识
        //dragdrop 松手的时候添加一个元素
        containerRef.value.addEventListener("dragenter", dragenter)
        containerRef.value.addEventListener("dragover", dragover)
        containerRef.value.addEventListener("dragleave", dragleave)
        containerRef.value.addEventListener("drop", drop)
        currentCompoent = compoent;
    }
    const dragEnd = (e) => {
        containerRef.value.removeEventListener("dragenter", dragenter)
        containerRef.value.removeEventListener("dragover", dragover)
        containerRef.value.removeEventListener("dragleave", dragleave)
        containerRef.value.removeEventListener("drop", drop)
    }
    return {
        dragStart,
        dragEnd
    }
}