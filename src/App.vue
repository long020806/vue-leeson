<template>
    <div class="app"> 
      <!-- :modelValue @update:modelValue="xxx" -->
      <Editor v-model="state" ></Editor>      
    </div>
</template>
<script>
    import data from './data.json'
    import {
        provide,
        ref
    } from "vue";

    import Editor from "./components/editor"
    import {
        registerConfig as config
    } from "./utils/editor-config"
    export default {
        components: {
            Editor
        },
        setup(props) {
            const state = ref(data)
            provide("config", config); //将组建配置直接传递
            return {
                state
            }
        }
    }
</script>
<style lang="scss">
    .app {
        position: fixed;
        top: 20px;
        left: 20px;
        bottom: 20px;
        right: 20px;
    }
</style>