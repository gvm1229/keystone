// Keystatic CMS 설정 - 블로그 포스트 전용 (포트폴리오와 분리)
import { config, fields, collection } from "@keystatic/core";

export default config({
    storage: {
        kind: "local",
    },
    collections: {
        posts: collection({
            label: "블로그 포스트",
            slugField: "title",
            path: "src/content/posts/*",
            format: { contentField: "content" },
            schema: {
                title: fields.slug({
                    name: {
                        label: "제목",
                    },
                }),
                description: fields.text({
                    label: "요약",
                    multiline: true,
                }),
                pubDate: fields.date({
                    label: "발행일",
                    defaultValue: { kind: "today" },
                }),
                content: fields.markdoc({
                    label: "본문",
                    options: {
                        // 에디터에서 추가/붙여넣기한 이미지를 로컬 디렉터리로 복사
                        image: {
                            directory: "public/images/posts",
                            publicPath: "/images/posts/",
                        },
                    },
                }),
            },
        }),
    },
});
