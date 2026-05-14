<script setup lang="ts">
const props = defineProps<{
  post: {
    path: string
    title: string
    date?: string | null
  }
}>();

function monthDayLabel(date?: string | null) {
  if (!date) return null;
  const t = Date.parse(date);
  if (!Number.isFinite(t)) return null;
  const d = new Date(t);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

const postMonthDay = computed(() => monthDayLabel(props.post.date));
</script>

<template>
  <article class="archive-card">
    <div class="archive-card__body">
      <h3 class="archive-card__title">
        <NuxtLink class="archive-card__title-link" :to="post.path">
          <span class="archive-card__title-text">{{ post.title }}</span>
          <time
            v-if="postMonthDay"
            class="archive-card__date"
            :datetime="post.date ?? undefined"
          >
            {{ postMonthDay }}
          </time>
        </NuxtLink>
      </h3>
    </div>
  </article>
</template>
