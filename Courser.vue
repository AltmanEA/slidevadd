<script setup lang="ts">
import { onMounted, ref } from "vue";

type Link = { text: string; url: string };

const isMenu = ref(false)

const title = ref("");
onMounted(() => {
  title.value = document.title.replace(/ - Slidev$/, "");
});
const linksArray = ref<Link[]>([]);
onMounted(async () => {
  const response = await fetch("../slide_list.md");
  const rawMarkdown = await response.text();
  console.log(response);
  const links = rawMarkdown.split('\n').map(line => {
    const textMatch = line.match(/\[(.*?)\]/);
    const urlMatch = line.match(/\((.*?)\)/);
    if (textMatch && urlMatch) {
      return { text: textMatch[1], url: "." + urlMatch[1] };
    }
    return null;
  }).filter(item => item !== null);
  linksArray.value = links;
});

const toggleMenu = () => isMenu.value = !isMenu.value;
</script>

<style scoped>
.courser {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 60%;
  padding: 5px;
  line-height: 1.4em;
}
.inline {
  display: inline;
}
</style>

<template>
  <div class="courser" @click="toggleMenu" v-if="!isMenu">{{ title }}</div>
  <div class="courser" v-if="isMenu">
    <div>
      <a class="inline" href="../index.html">🏠</a>
      <span class="inline">&nbsp;&nbsp;&nbsp;</span>
      <a class="inline" href="#" @click="toggleMenu">✕</a>
    </div>
    <ul>
      <li v-for="(link, index) in linksArray" :key="index"><a :href="link.url">{{ link.text }}</a></li>
    </ul>
  </div>
</template>