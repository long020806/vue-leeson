import { defineComponent,computed,inject } from "vue";
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
        // 返回render函数
        return ()=>{
            // 通过propsblock 的key属性从config中找到渲染的compoent渲染
            const component = config.componentMap[props.block.key];
            const RenderComponent = component.render();//安装最新版element-plus 报错降低至^1.0.2-beta.36
        // console.log(RenderComponent)

            // render函数渲染
            return     <div class="editor-block" style={blockStyles.value}>
                {RenderComponent}
                </div>
            
        }
    }
})