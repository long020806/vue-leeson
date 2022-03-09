import { computed,ref } from "vue"
export default function useFocus(data, callback) { //获取那些元素被选中
    const selectIndex = ref(-1) // 开始表示没有任何一个元素被选中
    const lastSelectBlock = computed(()=>data.value.blocks[selectIndex.value])
    const clearBlockFocus = () => {
        data.value.blocks.forEach(block => block.focus = false);
    }
    const blockMousedown = (e, block,index) => {
        e.preventDefault();
        e.stopPropagation();
        // block focus属性获取焦点
        if (e.shiftKey) {
            if(focusData.value.focus.length<=1){// 当选中元素只有一个时不会取消
                block.focus = true
            }else{
                block.focus = !block.focus
            }
        } else {
            if (!block.focus) {
                clearBlockFocus()
                block.focus = true; //要清空其他人的focus
            } 
            // 当自己被选中时再次点击不会取消
        }
        selectIndex.value = index;
        callback(e);
    }

    const focusData = computed(() => {
        let focus = [];
        let unfocused = [];
        data.value.blocks.forEach(block => {
            (block.focus ? focus : unfocused).push(block)
        })
        return {
            focus,
            unfocused
        }
    })
    const containerMousedown = () => {
        clearBlockFocus();
        selectIndex.value = -1;
    }
    return {
        focusData,
        blockMousedown,
        containerMousedown,
        lastSelectBlock
    }
}