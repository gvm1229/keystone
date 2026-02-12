/**
 * About 페이지 데이터 스키마 (src/data/about.json)
 * - sections: 경험 유형별 리스트
 * - competencySections: 역량 키워드별 리스트
 */

/** 경험 유형별 리스트 구분 */
export const ABOUT_SECTION_KEYS = [
    "학업/프로젝트",
    "동아리/대외활동",
    "연구/개발",
    "인턴/알바",
    "공모전/대회",
    "직무경험",
    "개인사업",
    "기타",
] as const;

export type AboutSectionKey = (typeof ABOUT_SECTION_KEYS)[number];

/** 역량 키워드별 리스트 구분 */
export const COMPETENCY_SECTION_KEYS = [
    "문제해결",
    "협업/소통",
    "도전/혁신",
    "리더십/팔로우십",
    "성공/몰입",
    "실패/성장",
    "의사결정",
] as const;

export type CompetencySectionKey = (typeof COMPETENCY_SECTION_KEYS)[number];

export interface AboutContacts {
    email?: string;
    github?: string;
    linkedin?: string;
}

export type AboutSections = Record<AboutSectionKey, string[]>;
export type AboutCompetencySections = Record<CompetencySectionKey, string[]>;

export interface AboutData {
    profileImage?: string;
    name?: string;
    description?: string;
    descriptionSub?: string;
    contacts?: AboutContacts;
    /** 경험 유형별 리스트 (테이블 1) */
    sections?: AboutSections;
    /** 역량 키워드별 리스트 (테이블 2) */
    competencySections?: AboutCompetencySections;
}

/** 경험 유형별 입력 가이드용 플레이스홀더 (Admin 폼에서 사용) */
export const SECTION_PLACEHOLDERS: Record<AboutSectionKey, string> = {
    "학업/프로젝트": "예: 졸업 프로젝트 – OO 시스템 개발\n\n팀 프로젝트 – 웹 서비스 기획 및 구현",
    "동아리/대외활동": "예: OO 동아리 (20XX~20XX), 담당 역할\n\nOO 대외활동 프로그램 수료",
    "연구/개발": "예: OO 연구실 인턴, 참여 과제\n\n논문/발표: 주제 및 역할",
    "인턴/알바": "예: OO사 인턴 (20XX.XX~20XX.XX)\n\n담당 업무 및 성과",
    "공모전/대회": "예: OO 공모전 OO상 (연도)\n\nOO 대회 참가 및 결과",
    "직무경험": "예: OO사 OO직 (20XX~20XX)\n\n주요 업무, 성과, 기술 스택",
    "개인사업": "예: OO 사업/프로젝트 (기간)\n\n역할, 규모, 성과",
    "기타": "예: 자격증, 수상, 봉사 등\n\n다른 항목에 넣기 어려운 경험",
};

/** 역량 키워드별 입력 가이드용 플레이스홀더 (Admin 폼에서 사용) */
export const COMPETENCY_PLACEHOLDERS: Record<CompetencySectionKey, string> = {
    "문제해결": "예: 어떤 문제를 어떻게 정의했고, 어떤 방법으로 해결했는지 구체적 사례",
    "협업/소통": "예: 팀 프로젝트에서의 역할, 갈등 조정, 원격/오프라인 소통 경험",
    "도전/혁신": "예: 새로운 기술·방법 도입, 업무 프로세스 개선 시도",
    "리더십/팔로우십": "예: 팀 리드, 멘토링, 또는 적극적 팔로워로 기여한 사례",
    "성공/몰입": "예: 목표 달성 또는 깊이 몰입해 성과를 낸 경험 (기간, 결과 포함)",
    "실패/성장": "예: 실패에서 배운 점, 피드백 반영 후 개선한 경험",
    "의사결정": "예: 중요한 결정을 내린 상황, 근거, 그리고 그 결과",
};
