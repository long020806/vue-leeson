import { computed } from "vue"
export default function useFocus(data, callback) { //获取那些元素被选中
    const clearBlockFocus = () => {
        data.value.blocks.forEach(block => block.focus = false);
    }
    const blockMousedown = (e, block) => {
        e.preventDefault();
        e.stopPropagation();
        // block focus属性获取焦点
        if (e.shiftKey) {
            block.focus = !block.focus
        } else {
            if (!block.focus) {
                clearBlockFocus()
                block.focus = true; //要清空其他人的focus
            } else {
                block.focus = false;
            }
        }
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
    }
    return {
        focusData,
        blockMousedown,
        containerMousedown
    }
}