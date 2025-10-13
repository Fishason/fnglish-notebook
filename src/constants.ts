export const APP_NAME = 'Fnglish Notebook';
export const APP_VERSION = '1.0.0';

export const ENGLISH_LEVELS = [
  { label: '中学水平', value: 'middle_school' as const },
  { label: '大学水平', value: 'university' as const },
  { label: '留学水平', value: 'study_abroad' as const }
];

export const TENCENT_CLOUD_ENDPOINT = 'tmt.tencentcloudapi.com';
export const TENCENT_CLOUD_VERSION = '2018-03-21';

export const NOTION_DATABASE_NAME = 'fnglish-notebook';
export const NOTION_DATABASE_PROPERTIES = {
  '单词': { title: {} },
  '词性': { select: { options: [] } },
  '释义': { rich_text: {} },
  '例句': { rich_text: {} },
  '例句翻译': { rich_text: {} },
  '创建时间': { created_time: {} }
};

export const LOGO = `
  ███████╗███╗   ██╗ ██████╗ ██╗     ██╗███████╗██╗  ██╗
  ██╔════╝████╗  ██║██╔════╝ ██║     ██║██╔════╝██║  ██║
  █████╗  ██╔██╗ ██║██║  ███╗██║     ██║███████╗███████║
  ██╔══╝  ██║╚██╗██║██║   ██║██║     ██║╚════██║██╔══██║
  ██║     ██║ ╚████║╚██████╔╝███████╗██║███████║██║  ██║
  ╚═╝     ╚═╝  ╚═══╝ ╚═════╝ ╚══════╝╚═╝╚══════╝╚═╝  ╚═╝
                  📚 Your English Learning Companion
`;