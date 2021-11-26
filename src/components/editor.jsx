import { defineComponent ,computed,inject} from "vue"
import EditorBlock from "./editor-block";

import "./editor.scss";

export default defineComponent({
    components:{
        EditorBlock,
    },
    props:{
        modelValue:{tyoe:Object}
    },
    setup(props){
        const data = computed({
            get(){
                return props.modelValue;
            }
        })
        const containerStyles = computed(()=>({
            width:data.value.container.width+"px",
            height:data.value.container.height+"px"
        }))
        // console.log(data.value.container.width)
        // console.log(containerStyles)
        const config = inject("config")
        return ()=>(
            <div class="editor">
                <div class="editor-left">
                    {/* 根据注册列表渲染物料列表 */}
                        {
                            config.componentList.map(item=>(
                                
                                <div class="editor-left-item">
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
                        <div class="editor-container-canvas__content" style={containerStyles.value}>
                            {
                                data.value.blocks.map(item=>(
                                    <EditorBlock block={item}></EditorBlock>
                                ))
                            }
                        </div>
                    </div>
                </div>
                
            </div>
        )      
    }
})