import { defineComponent,computed,inject,ref,onMounted } from "vue";
export default defineComponent({
    props:{
        block:{type:Object}
    },
    setup(props){

        const blockStyles = computed(()=>({
            top:`${props.block.top}px`,
            left:`${props.block.left}px`,
            zIndex:props.block.zIndex
        }))
        const config = inject("config");

        let blockRef = ref(null);
        onMounted(()=>{
            // console.log(blockRef.value,props.block.left,props.block.top)
            let {offsetWidth,offsetHeight} = blockRef.value;
            if(props.block.alignCenter){//拖拽生成松手才居中其他默认内容不需要居中
                props.block.left = props.block.left - offsetWidth/2;
                props.block.top = props.block.top - offsetHeight/2;//原则上派发事件更改
                props.block.alignCenter = false;//让渲染后的结果才能居中
            }
            // 加载完成后设置宽高
            props.block.width = offsetWidth;
            props.block.height = offsetHeight;
        })


        // 返回render函数
        return ()=>{
            // 通过propsblock 的key属性从config中找到渲染的compoent渲染
            const component = config.componentMap[props.block.key];
            const RenderComponent = component.render();//安装最新版element-plus 报错降低至^1.0.2-beta.36
        // console.log(RenderComponent)

            // render函数渲染
            return     <div class="editor-block" style={blockStyles.value} ref={blockRef}>
                {RenderComponent}
                </div>
            
        }
    }
})