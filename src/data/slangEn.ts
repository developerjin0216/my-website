// Korean Slang & K-Culture Dictionary (/en/slang) — single source for
// the hub, per-term pages, and the sitemap. Audience: K-pop/K-drama fans
// searching "oppa meaning", "daebak meaning", "what is nunchi" in English.
// Entries are drafted + adversarially fact-checked before shipping.

export type SlangCategoryId = "honorific" | "expression" | "culture" | "fandom";

export const slangCategories: Record<
  SlangCategoryId,
  { name: string; emoji: string; desc: string }
> = {
  honorific: {
    name: "Address & Relationships",
    emoji: "🙇",
    desc: "Oppa, unnie, maknae — who can say what to whom",
  },
  expression: {
    name: "Expressions & Reactions",
    emoji: "💬",
    desc: "Daebak, heol, aigoo — what dramas keep saying",
  },
  culture: {
    name: "Culture Concepts",
    emoji: "🇰🇷",
    desc: "Nunchi, jeong, mukbang — ideas Korea runs on",
  },
  fandom: {
    name: "K-pop Fandom",
    emoji: "🎤",
    desc: "Bias, comeback, all-kill — fandom vocabulary decoded",
  },
};

export interface SlangEntry {
  id: string;
  roman: string; // display romanization, e.g. "Oppa"
  hangul: string;
  category: SlangCategoryId;
  meaning: string;
  literal: string; // literal translation / origin (hedged if uncertain)
  example: { ko: string; roman: string; en: string };
  usage: string; // where fans meet it + politeness caveats
  related: string[];
}

// 초안 작성 + 적대적 사실검증(워크플로 wf_9b2cf1d5) 완료분 — 52 entries
export const slangEntries: SlangEntry[] = [
  {
    "id": "oppa",
    "roman": "Oppa",
    "hangul": "오빠",
    "meaning": "The word a woman or girl uses for her older brother — and, by extension, for any older male she feels close to, including older male friends and boyfriends. Only female speakers use it; a man addressing an older man says \"hyung\" instead. Because it signals warmth and closeness, calling a non-relative \"oppa\" carries a flirtatious or affectionate undertone.",
    "literal": "A native Korean kinship term literally meaning \"a female's older brother.\"",
    "usage": "K-pop fans famously call male idols \"oppa\" regardless of blood relation, and in K-dramas the moment a woman switches to calling a man \"oppa\" often marks growing romantic interest. Be careful in real life: it's only for female speakers addressing a somewhat older male they're genuinely close to — using it with strangers, much older men, or in professional settings comes off as overly familiar or flirty.",
    "related": [
      "hyung",
      "noona",
      "unnie",
      "dongsaeng",
      "jagiya"
    ],
    "category": "honorific",
    "example": {
      "ko": "오빠, 오늘 무대 진짜 멋있었어요!",
      "roman": "Oppa, oneul mudae jinjja meosisseosseoyo!",
      "en": "Oppa, you were amazing on stage today!"
    }
  },
  {
    "id": "unnie",
    "roman": "Unnie",
    "hangul": "언니",
    "meaning": "What a woman or girl calls her older sister, or an older female friend she's close to. It's strictly for female speakers; a man addressing an older woman says \"noona\" instead. It conveys affection and a sister-like bond rather than formality.",
    "literal": "A native Korean kinship term meaning \"a female's older sister\" (Revised Romanization: eonni; fans usually spell it unnie).",
    "usage": "Female fans call older female idols \"unnie,\" and it's everywhere in girl-group interactions and K-drama sister dynamics; women also use it casually with slightly older women in shops or salons. The main misuse to avoid: male speakers should never use it — that's a classic learner mistake — and it presumes closeness, so don't lead with it toward someone you've just met in a formal setting.",
    "related": [
      "oppa",
      "noona",
      "hyung",
      "dongsaeng",
      "maknae"
    ],
    "category": "honorific",
    "example": {
      "ko": "언니, 이 옷 어디서 샀어?",
      "roman": "Unnie, i ot eodiseo sasseo?",
      "en": "Unnie, where did you buy this outfit?"
    }
  },
  {
    "id": "hyung",
    "roman": "Hyung",
    "hangul": "형",
    "meaning": "What a man or boy calls his older brother, or an older male friend he's close to. It's for male speakers only; women use \"oppa\" for older males. Adding -nim (\"hyungnim\") makes it more deferential — or, in crime dramas, is how gang members address the boss.",
    "literal": "From the Sino-Korean character 兄, meaning \"older brother.\"",
    "usage": "You'll hear it constantly among male K-pop group members and in K-drama bromances — younger members calling older ones \"hyung\" is a staple of behind-the-scenes content. Caveats: female speakers using it sounds odd (outside of jokey tomboy usage), and with an older man you don't actually know, a politer title is safer than jumping straight to \"hyung.\"",
    "related": [
      "oppa",
      "noona",
      "unnie",
      "maknae",
      "dongsaeng"
    ],
    "category": "honorific",
    "example": {
      "ko": "형, 밥 먹었어?",
      "roman": "Hyung, bap meogeosseo?",
      "en": "Hyung, have you eaten?"
    }
  },
  {
    "id": "noona",
    "roman": "Noona",
    "hangul": "누나",
    "meaning": "What a man or boy calls his older sister, or an older female friend he's close to. It's for male speakers only; women say \"unnie\" for older women. Like \"oppa,\" it can carry romantic potential when used toward a non-relative.",
    "literal": "A native Korean kinship term meaning \"a male's older sister\" (Revised Romanization: nuna; fans usually spell it noona).",
    "usage": "The \"noona romance\" — an older woman with a younger man — is a whole K-drama genre, and younger male idols melt fans by calling them \"noona.\" One caveat: it explicitly flags that the woman is older, so some women would rather not be called \"noona\" by a near-stranger; it's a term for people who are actually close.",
    "related": [
      "hyung",
      "oppa",
      "unnie",
      "dongsaeng"
    ],
    "category": "honorific",
    "example": {
      "ko": "누나, 이번 주말에 시간 있어요?",
      "roman": "Noona, ibeon jumare sigan isseoyo?",
      "en": "Noona, are you free this weekend?"
    }
  },
  {
    "id": "sunbae",
    "roman": "Sunbae",
    "hangul": "선배",
    "meaning": "A senior at your school, workplace, or industry — someone who entered before you, regardless of their actual age. Both men and women use it, usually with the honorific suffix as \"sunbaenim.\" The junior counterpart is \"hoobae.\"",
    "literal": "From the Sino-Korean 先輩, literally \"one who came before\" — the same characters as the Japanese \"senpai.\"",
    "usage": "In K-pop, groups that debuted earlier are sunbaes: rookie idols bow deeply and say \"sunbaenim\" to them on music shows, and failing to do so becomes an attitude scandal. In school and office dramas it structures every relationship. Politeness caveat: dropping the -nim to a senior's face, or treating a sunbae as an equal, reads as disrespectful.",
    "related": [
      "hoobae",
      "maknae",
      "kkondae"
    ],
    "category": "honorific",
    "example": {
      "ko": "선배님 무대 보면서 가수의 꿈을 키웠어요.",
      "roman": "Sunbaenim mudae bomyeonseo gasuui kkumeul kiwosseoyo.",
      "en": "Watching your performances, sunbaenim, is what made me dream of becoming a singer."
    }
  },
  {
    "id": "hoobae",
    "roman": "Hoobae",
    "hangul": "후배",
    "meaning": "A junior at your school, workplace, or industry — someone who entered after you, regardless of age. It's mostly used to describe the relationship rather than to address someone: you'd say \"she's my hoobae,\" but call the person by their name. The senior counterpart is \"sunbae.\"",
    "literal": "From the Sino-Korean 後輩, literally \"one who comes after\" (Revised Romanization: hubae; fans usually spell it hoobae).",
    "usage": "K-pop fans hear it whenever a newer group covers a legendary sunbae's song or an idol mentors \"hoobaes\" on survival shows. Usage note: unlike \"sunbaenim,\" you don't normally call someone \"hoobae\" to their face — it can sound condescending — and being someone's hoobae obligates polite speech toward the senior, not the other way around.",
    "related": [
      "sunbae",
      "dongsaeng",
      "maknae"
    ],
    "category": "honorific",
    "example": {
      "ko": "걔는 내 대학교 후배야.",
      "roman": "Gyaeneun nae daehakgyo hoobae-ya.",
      "en": "He's my hoobae from university."
    }
  },
  {
    "id": "dongsaeng",
    "roman": "Dongsaeng",
    "hangul": "동생",
    "meaning": "A younger sibling, or a younger close friend you treat like one — used by any gender about any gender. Like \"hoobae,\" it's mainly referential: you describe someone as your dongsaeng but address them by name. Add yeo- (여동생) for a younger sister or nam- (남동생) for a younger brother.",
    "literal": "Commonly traced to the Sino-Korean 同生, roughly \"born of the same (parents),\" now meaning any younger sibling or sibling-like junior.",
    "usage": "K-drama fans know the line \"just a close dongsaeng\" as the classic way a character denies (or hides) romantic feelings, and idols constantly introduce younger friends as their dongsaengs. No major politeness trap here, since it flows downward in age — just remember you generally don't call out \"dongsaeng-ah!\" to someone; use their name.",
    "related": [
      "maknae",
      "oppa",
      "unnie",
      "hyung",
      "noona"
    ],
    "category": "honorific",
    "example": {
      "ko": "걔는 그냥 친한 동생이야.",
      "roman": "Gyaeneun geunyang chinhan dongsaeng-iya.",
      "en": "He's just a close dongsaeng to me."
    }
  },
  {
    "id": "maknae",
    "roman": "Maknae",
    "hangul": "막내",
    "meaning": "The youngest person in any group — a family, an office team, and most famously a K-pop group. The maknae is stereotypically doted on by the older members but also expected to do aegyo and run errands. Anyone can use the word; it describes a role, not an address term with gender rules.",
    "literal": "A native Korean word for the last-born or youngest, from mak meaning \"the very end\" (pronounced \"mang-nae\"; the fan spelling maknae follows the written form).",
    "usage": "Every K-pop fandom celebrates its group's maknae, and tropes like the \"evil maknae\" (a youngest member who teases the elders) or \"giant maknae\" (youngest but tallest) are fandom staples. Pronunciation tip: it's \"mang-nae,\" not \"mak-nay.\" It's affectionate and safe to use — being the maknae comes with both pampering and chores.",
    "related": [
      "hyung",
      "unnie",
      "dongsaeng",
      "sunbae",
      "aegyo"
    ],
    "category": "honorific",
    "example": {
      "ko": "우리 막내가 벌써 스무 살이라니!",
      "roman": "Uri maknae-ga beolsseo seumu sarirani!",
      "en": "I can't believe our maknae is already twenty!"
    }
  },
  {
    "id": "ajumma",
    "roman": "Ajumma",
    "hangul": "아줌마",
    "meaning": "A middle-aged (typically married) woman, and a blunt way to address one — for example, calling out to the woman running a restaurant. In pop culture the ajumma is a whole archetype: permed hair, sun visor, fierce bargaining skills, and zero fear. Anyone can say it, but whether you should is another matter.",
    "literal": "A casual, shortened form of the politer ajumeoni (아주머니), a kinship-style term for a married woman of one's parents' generation.",
    "usage": "K-drama fans meet the ajumma archetype constantly — and also the classic scene where a character is outraged at being called one. That's the warning: to a woman who doesn't see herself as middle-aged, \"ajumma\" lands as an insult about her age and looks. Safer real-life options are jeogiyo (\"excuse me\"), imonim, or sajangnim; the polite form ajumeoni also softens it.",
    "related": [
      "ajusshi",
      "unnie",
      "noona",
      "kkondae"
    ],
    "category": "honorific",
    "example": {
      "ko": "아줌마, 여기 김치찌개 하나 주세요!",
      "roman": "Ajumma, yeogi kimchijjigae hana juseyo!",
      "en": "Ajumma, one kimchi stew over here, please!"
    }
  },
  {
    "id": "ajusshi",
    "roman": "Ajusshi",
    "hangul": "아저씨",
    "meaning": "A middle-aged man, and the default way to address an unrelated man of roughly that age — a taxi driver, a shop owner, a stranger on the street. It's the male counterpart of \"ajumma.\" Anyone can use it, but it instantly frames the man as older and unglamorous.",
    "literal": "Commonly said to have originally been a kinship term for an uncle-like male relative, later generalized to any middle-aged man (Revised Romanization: ajeossi; fans also spell it ahjussi).",
    "usage": "Fans know it from the 2010 film \"Ajusshi\" (released in English as \"The Man from Nowhere\") and from countless dramas where kids call a grown male lead \"ajusshi.\" Mild caveat: men in their late 20s or 30s often wince at being called one, since it implies they've aged out of \"oppa\" territory — related slang like ajae gag (\"dad joke\") plays on the same stereotype.",
    "related": [
      "ajumma",
      "kkondae",
      "hyung"
    ],
    "category": "honorific",
    "example": {
      "ko": "아저씨, 이 버스 명동 가요?",
      "roman": "Ajusshi, i beoseu Myeongdong gayo?",
      "en": "Ajusshi, does this bus go to Myeongdong?"
    }
  },
  {
    "id": "chingu",
    "roman": "Chingu",
    "hangul": "친구",
    "meaning": "\"Friend\" — but with a catch: in traditional Korean usage, chingu implies someone the same age as you, because equal age is what allows fully casual speech. Friends who are older or younger get relationship terms instead (hyung, unnie, noona, oppa, dongsaeng). You'll also see it in namja chingu (boyfriend) and yeoja chingu (girlfriend).",
    "literal": "From the Sino-Korean 親舊, roughly \"close\" + \"longtime.\"",
    "usage": "K-drama fans see characters ask each other's age within minutes of meeting precisely to settle whether they can be chingu and drop into casual speech. The caveat: declaring yourself someone's chingu — and speaking casually — when they're older than you can genuinely offend; age-mates only, unless the older person explicitly invites it.",
    "related": [
      "dongsaeng",
      "oppa",
      "unnie",
      "jagiya"
    ],
    "category": "honorific",
    "example": {
      "ko": "우리 동갑이네! 그럼 친구 하자.",
      "roman": "Uri donggabine! Geureom chingu haja.",
      "en": "We're the same age! Then let's be chingus."
    }
  },
  {
    "id": "jagiya",
    "roman": "Jagiya",
    "hangul": "자기야",
    "meaning": "\"Honey\" or \"darling\" — the standard pet name Korean couples call each other, used by both partners regardless of gender or age gap. It's what couples often graduate to after the \"oppa\" stage, and married couples keep using it for decades.",
    "literal": "Literally \"self\" (jagi) plus the vocative ending -ya — affectionately addressing your partner as, roughly, your other self.",
    "usage": "It's all over K-drama couple scenes and romance-variety shows, so fans absorb it fast. Caveat: it's squarely romantic — using it on someone you're not dating is either a confession or a joke. One quirk to know: middle-aged women sometimes call younger women \"jagi\" in a friendly, non-romantic way, which confuses learners.",
    "related": [
      "oppa",
      "aegyo",
      "chingu"
    ],
    "category": "honorific",
    "example": {
      "ko": "자기야, 오늘 저녁 뭐 먹을까?",
      "roman": "Jagiya, oneul jeonyeok mwo meogeulkka?",
      "en": "Honey, what should we have for dinner tonight?"
    }
  },
  {
    "id": "aegyo",
    "roman": "Aegyo",
    "hangul": "애교",
    "meaning": "A deliberately cute manner — baby-voiced talk, puffed cheeks, finger hearts, whiny charm — performed to be adorable and win someone over. It can be a personality trait (\"she's full of aegyo\") or an on-demand performance. Both men and women do it; male idols' aegyo is a fandom delight of its own.",
    "literal": "From the Sino-Korean 愛嬌, roughly \"love\" + \"charm.\"",
    "usage": "It's a variety-show staple: idols get ordered to do aegyo on the spot, and their delighted or mortified reactions become fancam gold. Fans use the word freely and there's no politeness trap — just know that in Korean workplaces, demanding aegyo from someone (especially a junior) is increasingly seen as inappropriate rather than cute.",
    "related": [
      "gwiyomi",
      "aegyo-sal",
      "maknae",
      "skinship"
    ],
    "category": "culture",
    "example": {
      "ko": "애교 한번 보여 주세요!",
      "roman": "Aegyo hanbeon boyeo juseyo!",
      "en": "Show us some aegyo!"
    }
  },
  {
    "id": "aegyo-sal",
    "roman": "Aegyo-sal",
    "hangul": "애교살",
    "meaning": "The small pouch of fat directly under the eyes that plumps up when you smile, making the eyes look bigger, younger, and friendlier. In K-beauty it's a coveted feature — the opposite of Western makeup's war on under-eye anything. People highlight it with makeup or even get fillers to create it.",
    "literal": "Literally \"aegyo flesh\" — sal means flesh or fat — i.e., \"charming fat\" under the eyes.",
    "usage": "K-beauty tutorials and idol makeup breakdowns mention it constantly, and fans praise idols' natural aegyo-sal in photos. The key distinction to get right: aegyo-sal is NOT eye bags or dark circles — those signal exhaustion, while aegyo-sal sits higher, right on the lower lash line, and signals youth. No politeness risk; complimenting someone's aegyo-sal is flattering.",
    "related": [
      "aegyo",
      "gwiyomi"
    ],
    "category": "culture",
    "example": {
      "ko": "애교살 메이크업은 어떻게 해요?",
      "roman": "Aegyo-sal meikeueobeun eotteoke haeyo?",
      "en": "How do you do aegyo-sal makeup?"
    }
  },
  {
    "id": "gwiyomi",
    "roman": "Gwiyomi",
    "hangul": "귀요미",
    "meaning": "\"Cutie\" — an affectionate noun for an adorable person, pet, or thing. It's playful, casual slang you'd use about a friend, an idol, or a puppy. It also names the viral \"Gwiyomi Song\" aegyo routine.",
    "literal": "A playful coinage from the adjective gwiyeopda (귀엽다, \"to be cute\"), roughly \"cutie.\"",
    "usage": "Fans mostly know it from the \"Gwiyomi Song\" (귀요미송), Hari's 2013 viral hit built on the \"Gwiyomi Player\" counting routine popularized by BTOB's Ilhoon in late 2012 — \"1 plus 1 is gwiyomi!\" with finger gestures — that idols were endlessly asked to perform on camera. It's cutesy, informal register: fine among friends and fans, but not something you'd call your boss.",
    "related": [
      "aegyo",
      "aegyo-sal",
      "maknae"
    ],
    "category": "culture",
    "example": {
      "ko": "우리 강아지 완전 귀요미야.",
      "roman": "Uri gangaji wanjeon gwiyomiya.",
      "en": "Our puppy is a total gwiyomi."
    }
  },
  {
    "id": "skinship",
    "roman": "Skinship",
    "hangul": "스킨십",
    "meaning": "Affectionate physical touch — holding hands, back-hugs, leaning on shoulders, playing with someone's hair. It covers romantic touch between couples, but also the casual same-sex physical closeness that's normal between Korean friends and idol group members. It's a Konglish word, so don't expect English speakers outside K-culture circles to know it.",
    "literal": "A pseudo-English blend of \"skin\" + \"-ship\" (as in friendship); commonly said to have entered Korean via the Japanese coinage sukinshippu.",
    "usage": "K-pop fans use it constantly for member interactions — idols draped over each other in behind-the-scenes clips — where it signals closeness, not romance; in K-dramas, a couple's first skinship is a plot milestone. Cultural note for expats: friendly same-sex skinship (linked arms, hand-holding) is normal in Korea, but initiating touch with someone senior or unfamiliar is not.",
    "related": [
      "aegyo",
      "jagiya",
      "chingu"
    ],
    "category": "culture",
    "example": {
      "ko": "두 사람 스킨십이 너무 자연스러운데?",
      "roman": "Du saram skinship-i neomu jayeonseureounde?",
      "en": "Their skinship is so natural, though?"
    }
  },
  {
    "id": "kkondae",
    "roman": "Kkondae",
    "hangul": "꼰대",
    "meaning": "A condescending older person — typically a boss or senior — who lectures juniors, demands deference because of age or rank, and starts sentences with \"back in my day.\" Think \"OK boomer\" energy fused with a know-it-all manager. Younger Koreans use it behind such a person's back, never to their face.",
    "literal": "Origin uncertain: it circulated by the 1960s as student slang for strict teachers and fathers, and popular folk etymologies (a dialect word, or the French \"comte\" via colonial-era Japanese) remain unverified.",
    "usage": "Fans meet kkondae characters in every Korean office drama, and the meme catchphrase \"latte neun mariya\" (a pun on \"na ttae-neun mariya,\" \"back in my day\") is shorthand for kkondae behavior; the word even drew international media attention around 2019. Strong warning: it's a genuine insult about someone's character, not a neutral label like ajusshi — calling a senior a kkondae to their face is picking a fight.",
    "related": [
      "ajusshi",
      "ajumma",
      "sunbae"
    ],
    "category": "culture",
    "example": {
      "ko": "\"라떼는 말이야\"가 나오는 순간 꼰대 되는 거야.",
      "roman": "\"Latteneun mariya\"ga naoneun sungan kkondae doeneun geoya.",
      "en": "The moment you start with \"back in my day...\", you've become a kkondae."
    }
  },
  {
    "id": "daebak",
    "roman": "Daebak",
    "hangul": "대박",
    "meaning": "An exclamation of amazement — somewhere between \"awesome,\" \"jackpot,\" and \"no way.\" It describes anything unexpectedly huge or great (a hit song, a windfall, shocking gossip), and said sarcastically it can also mean \"unbelievable\" in a bad way. Everyone from teenagers to variety-show hosts uses it, usually among friends or as a spontaneous outburst.",
    "literal": "Usually glossed as \"big hit\" or \"jackpot\"; the origin is debated, with one popular folk explanation linking bak to the treasure-filled gourd in the folktale Heungbujeon, so take any single etymology with a grain of salt.",
    "usage": "One of the first words K-pop and K-drama fans pick up: idols gasp it on variety shows, and it's subtitled constantly. As an exclamation it's casual but harmless — you can blurt it out in most situations, though you wouldn't use it in a formal business setting.",
    "related": [
      "heol",
      "jinjja",
      "jjang",
      "omo"
    ],
    "category": "expression",
    "example": {
      "ko": "헐, 대박! 콘서트 티켓 당첨됐어!",
      "roman": "Heol, daebak! Konseoteu tiket dangcheomdwaesseo!",
      "en": "No way — jackpot! I won concert tickets!"
    }
  },
  {
    "id": "heol",
    "roman": "Heol",
    "hangul": "헐",
    "meaning": "A dumbfounded \"whoa,\" \"OMG,\" or \"seriously?\" — the sound of being too stunned to form a sentence. It covers shock, disbelief, and deadpan disappointment, and it's strictly casual, said among friends or muttered to yourself.",
    "literal": "Not a word with a literal meaning — an interjection that mimics a stunned exhale, popularized as youth and text-message slang in the 2000s.",
    "usage": "Constant on variety shows, idol lives, and in fan comment sections — often flashed on screen as a caption when someone is speechless. It's slangy and flat in tone, so save it for friends and online; saying \"heol\" to your boss or an elder would come off flippant.",
    "related": [
      "daebak",
      "mwoya",
      "jinjja",
      "omo"
    ],
    "category": "expression",
    "example": {
      "ko": "헐, 걔가 나한테 거짓말했다고?",
      "roman": "Heol, gyaega nahante geojinmalhaetdago?",
      "en": "Whoa... he lied to me?"
    }
  },
  {
    "id": "jinjja",
    "roman": "Jinjja",
    "hangul": "진짜",
    "meaning": "\"Really?\" or \"seriously\" — it works as a question (Jinjja? \"For real?\"), an intensifier (jinjja mashisseo, \"really delicious\"), and an exasperated groan (Jinjja...! \"Ugh, seriously!\"). It's everyday speech used by everyone, though the bare form is casual.",
    "literal": "From the Sino-Korean jin (真, \"true, genuine\") plus the suffix jja (\"thing, stuff\") — literally \"the real thing.\"",
    "usage": "Probably the single most common word fans hear in dramas and idol content — listen for it in almost every reaction shot. It's fine with peers; add -yo (jinjjayo?) when speaking to someone older or someone you don't know well.",
    "related": [
      "heol",
      "daebak",
      "mwoya"
    ],
    "category": "expression",
    "example": {
      "ko": "이 노래 진짜 좋아.",
      "roman": "I norae jinjja joa.",
      "en": "This song is really good."
    }
  },
  {
    "id": "aigoo",
    "roman": "Aigoo",
    "hangul": "아이고",
    "meaning": "An all-purpose sigh: \"oh dear,\" \"oof,\" \"oh my goodness.\" It expresses fatigue, sympathy, exasperation, or fond dismay — a grandmother groaning as she sits down, a parent cooing over a child, a friend reacting to your bad luck. Anyone can say it to anyone; the target matters less than the sigh itself.",
    "literal": "A native Korean interjection with no component parts — essentially a verbal groan or gasp (standard romanization aigo; fans usually write \"aigoo\").",
    "usage": "Fans hear it from drama parents and grandparents, and from idols playacting as tired old-timers — it's stereotypically an \"old person sound,\" which is exactly why young people use it for comic effect. There's no politeness risk, but overusing it can make you sound like you're doing an ajumma impression.",
    "related": [
      "omo",
      "heol",
      "gwaenchana"
    ],
    "category": "expression",
    "example": {
      "ko": "아이고, 우리 막내 잘했네!",
      "roman": "Aigoo, uri maknae jalhaenne!",
      "en": "Aww, our maknae did so well!"
    }
  },
  {
    "id": "omo",
    "roman": "Omo",
    "hangul": "어머",
    "meaning": "A startled \"Oh my!\" — the reflexive gasp when something surprises, delights, or scandalizes you, often doubled as omo omo for extra fluster. It's stereotypically feminine speech, typically among friends or as an involuntary outburst.",
    "literal": "A native interjection with no literal breakdown; the standard form is eomeo, but fans and subtitles usually write \"omo.\"",
    "usage": "A staple of drama reaction shots and gossiping side characters, and idols use it playfully on lives. Because it reads as feminine, men saying it usually come across as joking or doing aegyo — which is often the point.",
    "related": [
      "heol",
      "aigoo",
      "daebak"
    ],
    "category": "expression",
    "example": {
      "ko": "어머, 어떡해! 지갑 놓고 왔어!",
      "roman": "Omo, eotteokae! Jigap noko wasseo!",
      "en": "Oh my, what do I do — I left my wallet behind!"
    }
  },
  {
    "id": "jebal",
    "roman": "Jebal",
    "hangul": "제발",
    "meaning": "\"Please, I'm begging you\" — a desperate, emotional plea, not a polite formality. You say it when you really need something: begging a friend for a favor, pleading with fate, imploring someone not to leave. It works at any level of intimacy because the desperation, not the politeness, is the message.",
    "literal": "A single adverb of pleading, roughly \"I beg (you)\" or \"for goodness' sake\"; it doesn't break down into smaller literal parts in modern Korean.",
    "usage": "Fans know it from countless song lyrics and tearful drama scenes, and from fan chants begging for a comeback or an encore. Key caveat: it is NOT the English \"please\" for ordering coffee — Korean politeness lives in verb endings, so tacking jebal onto a routine request sounds like you're dramatically begging.",
    "related": [
      "andwae",
      "mianhae",
      "gwaenchana"
    ],
    "category": "expression",
    "example": {
      "ko": "제발 한 번만 도와줘!",
      "roman": "Jebal han beonman dowajwo!",
      "en": "Please, help me just this once!"
    }
  },
  {
    "id": "hwaiting",
    "roman": "Hwaiting",
    "hangul": "화이팅",
    "meaning": "\"You can do it!\" / \"Go, go!\" — a cheer of encouragement before exams, performances, games, or any challenge. It's Konglish, so it means \"good luck, give it your all\" rather than anything combative, and anyone can say it to anyone in a cheering context.",
    "literal": "Borrowed from the English word \"fighting\" and reshaped by Korean pronunciation; the officially standard spelling is 파이팅 (paiting), but 화이팅 is what people actually write.",
    "usage": "Ubiquitous in fan culture: idols end lives and VCRs with a fist-clench and \"hwaiting!\", and fans comment it under everything. It's one of the safest words in this dictionary — cheerful in any company — though in very formal settings you'd pair it with polite speech around it.",
    "related": [
      "chukahae",
      "jjang",
      "gwaenchana"
    ],
    "category": "expression",
    "example": {
      "ko": "시험 잘 봐! 화이팅!",
      "roman": "Siheom jal bwa! Hwaiting!",
      "en": "Good luck on your exam — fighting!"
    }
  },
  {
    "id": "saranghae",
    "roman": "Saranghae",
    "hangul": "사랑해",
    "meaning": "\"I love you\" in its casual, intimate form — said between couples, close friends, family, and famously between idols and fans. Because it drops the polite ending, it signals closeness as much as affection.",
    "literal": "From sarang (\"love\") plus hae (\"do\") — literally \"(I) do love (you),\" the casual conjugation of the verb saranghada.",
    "usage": "The word every fan learns first: idols shout it at concerts and sign off lives with it, often with the finger-heart gesture. The bare form is banmal (casual speech), so with someone older or not close, saranghaeyo is the safer polite version — though in the idol-fan relationship the casual form is the affectionate norm.",
    "related": [
      "bogosipeo",
      "chukahae",
      "mianhae"
    ],
    "category": "expression",
    "example": {
      "ko": "오빠, 사랑해! 오늘 무대 최고였어!",
      "roman": "Oppa, saranghae! Oneul mudae choegoyeosseo!",
      "en": "Oppa, I love you! Today's stage was the best!"
    }
  },
  {
    "id": "jjang",
    "roman": "Jjang",
    "hangul": "짱",
    "meaning": "\"The best,\" \"awesome,\" \"top-tier\" — slangy praise for people and things alike (eolgul jjang, \"best face\"). In school slang it can also mean the boss or toughest kid. It's friendly, punchy praise used among peers.",
    "literal": "The origin is uncertain; it's commonly said to derive from the Sino-Korean jang (長, \"chief\" or \"head\"), as in the top person of a group, though this is folk etymology rather than settled fact.",
    "usage": "Fans see it in fan comments, variety-show captions, and compounds like ulzzang (\"best face\"). It's distinctly casual and slightly retro-cute these days — great with friends and online, out of place in anything formal.",
    "related": [
      "daebak",
      "jinjja",
      "hwaiting"
    ],
    "category": "expression",
    "example": {
      "ko": "우리 언니 진짜 짱이야!",
      "roman": "Uri unnie jinjja jjangiya!",
      "en": "My unnie is seriously the best!"
    }
  },
  {
    "id": "kekeke",
    "roman": "Kekeke (ㅋㅋㅋ)",
    "hangul": "ㅋㅋㅋ",
    "meaning": "Korean text-laughter: the consonant ㅋ (a \"k\" sound) repeated, equivalent to \"lol\" or \"hahaha.\" More ㅋs means harder laughing — ㅋㅋㅋㅋㅋ is cracking up, while a single ㅋ can read as dry, sarcastic, or dismissive. It lives almost entirely in texting and comments rather than speech.",
    "literal": "ㅋ is the Korean letter kieuk, representing a /k/ sound; strings of it imitate the sound of snickering (\"k-k-k\"), which fans transliterate as \"kekeke\" or \"kkk.\"",
    "usage": "Fans meet it in idols' Bubble and Weverse messages, in comment sections, and in fan translations that keep \"keke\" intact. Its softer sibling ㅎㅎ (\"heheh\") is a gentler, safer smile-laugh — better for polite or professional chats — while a lone ㅋ can land as cold, so when in doubt, use at least two or three.",
    "related": [
      "heol",
      "daebak",
      "mwoya"
    ],
    "category": "expression",
    "example": {
      "ko": "그 짤 봤어? ㅋㅋㅋㅋ 진짜 웃겨.",
      "roman": "Geu jjal bwasseo? Kekekeke, jinjja utgyeo.",
      "en": "Did you see that meme? Kekeke, it's hilarious."
    }
  },
  {
    "id": "ppalli-ppalli",
    "roman": "Ppalli-ppalli",
    "hangul": "빨리빨리",
    "meaning": "\"Hurry, hurry!\" — the doubled adverb for \"quickly,\" barked when someone needs to move faster. Beyond the literal command, it names Korea's famous ppalli-ppalli culture: same-day delivery, lightning internet, food arriving before you've sat down, and a collective impatience with waiting.",
    "literal": "Ppalli is the adverb form of ppareuda (\"to be fast\"); doubling it intensifies the urgency — literally \"quickly, quickly.\"",
    "usage": "Fans hear it on variety shows whenever cast members dawdle, and expats quickly learn it as shorthand for Korean speed culture. Barking the bare form at someone is bossy banmal — fine with friends or kids, but with elders, staff, or strangers soften it (ppalliyo, or a full polite sentence).",
    "related": [
      "andwae",
      "mwoya"
    ],
    "category": "expression",
    "example": {
      "ko": "빨리빨리 와! 버스 놓치겠어!",
      "roman": "Ppalli ppalli wa! Beoseu nochigesseo!",
      "en": "Hurry up and come — we're going to miss the bus!"
    }
  },
  {
    "id": "bogosipeo",
    "roman": "Bogosipeo",
    "hangul": "보고싶어",
    "meaning": "\"I miss you\" — literally \"I want to see you,\" which is exactly how Korean expresses missing a person. The bare form is intimate, said to partners, close friends, family, and by idols to their fans.",
    "literal": "From boda (\"to see\") plus the -go sipda (\"want to\") construction — literally \"(I) want to see (you).\"",
    "usage": "A ballad-lyric staple — fans recognize it from countless choruses — and idols say it to fans after tour breaks, while fans flood comments with it. It's banmal, so use bogosipeoyo with someone you're not close to; note it only works for missing people or animals you can \"see,\" not for missing the bus.",
    "related": [
      "saranghae",
      "mianhae",
      "gwaenchana"
    ],
    "category": "expression",
    "example": {
      "ko": "언제 와? 너무 보고싶어.",
      "roman": "Eonje wa? Neomu bogosipeo.",
      "en": "When are you coming back? I miss you so much."
    }
  },
  {
    "id": "gwaenchana",
    "roman": "Gwaenchana",
    "hangul": "괜찮아",
    "meaning": "\"It's okay / I'm fine / no worries\" — reassurance, comfort, or forgiveness, and as a question (Gwaenchana?) \"Are you okay?\" It also works as a polite-ish refusal: answering gwaenchana to an offer means \"I'm good, thanks.\" The bare form is for friends and people younger or close to you.",
    "literal": "The casual form of gwaenchanta (\"to be okay\"); the word is commonly said to be a contraction of an older phrase meaning roughly \"it's not uncalled-for,\" though the etymology is debated.",
    "usage": "The soundtrack of every K-drama comfort scene — one character patting another's back murmuring \"gwaenchana, gwaenchana\" — and a frequent song lyric. Use gwaenchanayo with elders and strangers; also remember the refusal meaning, so if someone offers you food and you say it, you've just said no thanks.",
    "related": [
      "mianhae",
      "andwae",
      "hwaiting"
    ],
    "category": "expression",
    "example": {
      "ko": "괜찮아, 다 잘될 거야.",
      "roman": "Gwaenchana, da jaldoel geoya.",
      "en": "It's okay — everything's going to work out."
    }
  },
  {
    "id": "andwae",
    "roman": "Andwae",
    "hangul": "안돼",
    "meaning": "\"No way!\" / \"You can't!\" / \"That's not allowed!\" — a refusal, prohibition, or cry of despair. It ranges from a parent telling a kid no, to a fan wailing at bad news, to a drama heroine screaming it at a cliffhanger. The bare form is blunt and casual.",
    "literal": "From an (\"not\") plus doeda (\"to become, to be allowed\") — literally \"(it) won't do.\"",
    "usage": "Fans know the drawn-out \"ANDWAE!!\" from drama cliffhangers and from their own reactions to disbandment rumors — it's practically a fandom meme. It's blunt banmal: telling an elder or a stranger andwae sounds like scolding, so use an dwaeyo or an doemnida to be polite.",
    "related": [
      "heol",
      "jebal",
      "mwoya"
    ],
    "category": "expression",
    "example": {
      "ko": "안돼! 그거 먹으면 안돼!",
      "roman": "Andwae! Geugeo meogeumyeon andwae!",
      "en": "No! You can't eat that!"
    }
  },
  {
    "id": "chukahae",
    "roman": "Chukahae",
    "hangul": "축하해",
    "meaning": "\"Congrats!\" — the casual way to congratulate someone on a birthday, graduation, win, or good news. Said to friends, peers, and people younger than you; the politeness scales up through chukahaeyo to the formal chukadeurimnida.",
    "literal": "From the Sino-Korean chukha (祝賀, \"congratulation\") plus hae (\"do\") — literally \"(I) congratulate (you)\"; the ㅎ blends in speech so it sounds like \"chuka-hae.\"",
    "usage": "Fans sing it in the Korean birthday song (saengil chukahamnida) and spam it whenever their group takes a music-show win, tops a chart, or grabs a daesang. Casual form for friends and faves; switch to chukahaeyo or chukadeurimnida for elders and formal messages.",
    "related": [
      "hwaiting",
      "saranghae",
      "daebak"
    ],
    "category": "expression",
    "example": {
      "ko": "생일 축하해! 케이크 사왔어!",
      "roman": "Saengil chukahae! Keikeu sawasseo!",
      "en": "Happy birthday! I brought cake!"
    }
  },
  {
    "id": "mianhae",
    "roman": "Mianhae",
    "hangul": "미안해",
    "meaning": "\"I'm sorry\" in its casual, personal form — apologies between friends, siblings, and couples, from a mumbled \"my bad\" to a tearful drama confession. It carries emotional weight precisely because it's intimate rather than formal.",
    "literal": "From the Sino-Korean mian (未安, roughly \"not at ease\") plus hae (\"do\") — literally \"(I feel) uneasy (toward you).\"",
    "usage": "A K-drama essential — the rain-soaked \"mianhae\" scene is a genre fixture — and a frequent song title. It's banmal: with elders, bosses, or strangers, use mianhaeyo at minimum, and in serious or professional situations the correct word is joesonghamnida; apologizing to your boss with mianhae would itself require an apology.",
    "related": [
      "gwaenchana",
      "jebal",
      "saranghae"
    ],
    "category": "expression",
    "example": {
      "ko": "늦어서 미안해. 많이 기다렸지?",
      "roman": "Neujeoseo mianhae. Mani gidaryeotji?",
      "en": "Sorry I'm late. You waited a long time, didn't you?"
    }
  },
  {
    "id": "mwoya",
    "roman": "Mwoya",
    "hangul": "뭐야",
    "meaning": "\"What is this?\" / \"What the—?!\" — an incredulous or annoyed reaction to something weird, unfair, or unexpected. Between friends it's often playful (\"what are you even like?\"), but with an edge in the voice it means genuine irritation. Strictly casual speech.",
    "literal": "From mwo (\"what\") plus the casual copula ending -ya — literally \"what is (it)?\"",
    "usage": "A constant on variety shows and idol lives, usually when someone gets pranked or teased, and it's subtitled everywhere. It's banmal and can sound confrontational: saying mwoya to a stranger or elder reads as picking a fight, and even the polite-ish mwoyeyo? still comes off blunt.",
    "related": [
      "heol",
      "jinjja",
      "andwae"
    ],
    "category": "expression",
    "example": {
      "ko": "뭐야, 왜 나한테 말 안 했어?",
      "roman": "Mwoya, wae nahante mal an haesseo?",
      "en": "What the heck — why didn't you tell me?"
    }
  },
  {
    "id": "nunchi",
    "roman": "Nunchi",
    "hangul": "눈치",
    "meaning": "The subtle art of reading a room: sensing other people's unspoken moods, needs, and the social hierarchy, then adjusting your behavior before anyone has to say a word. Someone with quick nunchi (nunchi-ga ppareuda) notices the boss is irritated or a friend is hurting without being told; someone with no nunchi (nunchi-ga eopda) blunders straight through social cues. In Korea's high-context, hierarchy-aware culture it's treated as a core life skill — for getting along at work, in family, and among friends.",
    "literal": "Often glossed as 'eye-measure' — from nun (눈, eye) plus chi, commonly explained as a sense of gauging things, i.e., what you size up with your eyes.",
    "usage": "You'll hear it constantly in office K-dramas and variety shows (there's even a party game called the 'nunchi game'), and it's been the subject of English-language self-help books. Note the sting: telling a Korean speaker they have no nunchi is a genuine criticism of their social competence, not gentle teasing.",
    "related": [
      "jeong",
      "gapjil"
    ],
    "category": "culture",
    "example": {
      "ko": "그 신입은 눈치가 빨라서 다들 좋아해.",
      "roman": "Geu sinibeun nunchiga ppallaseo dadeul joahae.",
      "en": "The new hire reads the room so well that everyone likes him."
    }
  },
  {
    "id": "jeong",
    "roman": "Jeong",
    "hangul": "정",
    "meaning": "A deep, slow-growing bond of attachment that forms between people — and even toward places, pets, or objects — through shared time and experience. It's broader than love or friendship: Koreans speak of miun jeong (미운 정), the attachment you develop even toward someone who drives you crazy, alongside goun jeong (고운 정), fond attachment. Jeong is described as something that 'seeps in' (jeong-i deulda) rather than something you choose, and it's often cited as a defining trait of Korean relationships.",
    "literal": "From the Sino-Korean character 情 (jeong), meaning feeling, sentiment, or affection.",
    "usage": "Fans meet jeong in K-dramas whenever characters keep caring for someone they claim to dislike, and in essays explaining why Korean coworkers feed you and neighbors share food. There's no politeness trap, but don't use it lightly for a new acquaintance — jeong specifically implies a bond built up over time.",
    "related": [
      "nunchi",
      "somaek"
    ],
    "category": "culture",
    "example": {
      "ko": "10년을 같이 일했으니 미운 정 고운 정 다 들었지.",
      "roman": "Simnyeoneul gachi ilhaesseuni miun jeong goun jeong da deureotji.",
      "en": "After working together for ten years, we've grown attached — warts and all."
    }
  },
  {
    "id": "gapjil",
    "roman": "Gapjil",
    "hangul": "갑질",
    "meaning": "Abusive, high-handed behavior by someone in a position of power toward the people beneath them — a boss humiliating staff, a customer berating service workers, an executive treating employees like servants. The word became a household term in the 2010s amid high-profile scandals involving chaebol families, including the 2014 Korean Air 'nut rage' incident that made international headlines. It names a structural problem, not a one-off rude moment: the powerful party exploiting the fact that the weaker party can't fight back.",
    "literal": "From gap (갑), the label for the dominant 'Party A' in a Korean contract, plus -jil (-질), a derogatory suffix for contemptible behavior.",
    "usage": "K-culture fans mostly encounter gapjil in entertainment-industry news and in workplace-revenge dramas. Be aware it's a serious accusation of misconduct — calling a real person's behavior gapjil is closer to alleging abuse of power than to calling them bossy.",
    "related": [
      "chaebol",
      "nunchi"
    ],
    "category": "culture",
    "example": {
      "ko": "저 손님 또 직원한테 갑질하네.",
      "roman": "Jeo sonnim tto jigwonhante gapjilhane.",
      "en": "That customer is bullying the staff again."
    }
  },
  {
    "id": "chaebol",
    "roman": "Chaebol",
    "hangul": "재벌",
    "meaning": "A large family-owned and family-controlled business conglomerate — Samsung, Hyundai, LG, and SK are the classic examples. Chaebol dominate the Korean economy, and their founding families' succession battles and scandals are constant news. In K-drama land, the arrogant-but-secretly-wounded chaebol heir is one of the most durable romance tropes.",
    "literal": "Sino-Korean 財閥, roughly 'wealth clan' — written with the same characters as the Japanese term zaibatsu.",
    "usage": "Fans see 'chaebol' in drama synopses ('chaebol heir falls for ordinary girl') and in news about corporate scandals or gapjil cases. Note the spelling: 'chaebol' is the established English form, though Revised Romanization would render it 'jaebeol.' It refers to the conglomerate or its family, not just any rich person.",
    "related": [
      "gapjil"
    ],
    "category": "culture",
    "example": {
      "ko": "이번 남주는 재벌 2세인데 성격이 까칠해.",
      "roman": "Ibeon namjuneun jaebeol iseinde seonggyeogi kkachilhae.",
      "en": "This drama's male lead is a second-generation chaebol heir with a prickly personality."
    }
  },
  {
    "id": "honbap",
    "roman": "Honbap",
    "hangul": "혼밥",
    "meaning": "Eating a meal alone — and, more broadly, the now-normalized culture of solo dining in a society where meals were traditionally communal. Once mildly stigmatized, honbap has become mainstream as single-person households grew, and many restaurants now offer solo seats and one-person portions. It has spawned a whole hon- family of words, like honsul (drinking alone).",
    "literal": "A blend of honja (혼자, alone) and bap (밥, cooked rice, i.e., a meal).",
    "usage": "You'll spot honbap in vlogs, dramas about single life, and travel guides listing honbap-friendly restaurants in Seoul. No politeness risk — it's neutral, everyday vocabulary, though older speakers may still read a touch of loneliness into it.",
    "related": [
      "mukbang",
      "jjimjilbang"
    ],
    "category": "culture",
    "example": {
      "ko": "혼밥이 편해서 요즘 자주 해.",
      "roman": "Honbabi pyeonhaeseo yojeum jaju hae.",
      "en": "Eating alone is comfortable, so I do it a lot these days."
    }
  },
  {
    "id": "mukbang",
    "roman": "Mukbang",
    "hangul": "먹방",
    "meaning": "An 'eating broadcast': a livestream or video where the host eats — often enormous quantities of food — while chatting with viewers or leaning into slurpy ASMR sounds. It's one of Korea's most successful internet-culture exports, now a global YouTube genre. Many viewers watch as virtual dinner company, which is why it's often linked to solo-dining culture.",
    "literal": "Short for meongneun bangsong (먹는 방송), 'eating broadcast'; commonly said to have taken off on the Korean streaming platform AfreecaTV in the late 2000s before spreading worldwide.",
    "usage": "Fans encounter mukbang on YouTube, in idol variety content (idols doing mukbangs is a beloved format), and in English media coverage of Korean internet culture. The word has fully entered English; Revised Romanization is 'meokbang,' but 'mukbang' is the spelling everyone actually uses.",
    "related": [
      "honbap",
      "jjimjilbang"
    ],
    "category": "culture",
    "example": {
      "ko": "어제 먹방 보다가 참지 못하고 라면 끓였어.",
      "roman": "Eoje meokbang bodaga chamji mothago ramyeon kkeuryeosseo.",
      "en": "I was watching a mukbang last night and couldn't resist making ramyeon."
    }
  },
  {
    "id": "somaek",
    "roman": "Somaek",
    "hangul": "소맥",
    "meaning": "The classic Korean bomb drink: a shot of soju dropped or poured into a glass of beer. It's the default social lubricant at hoesik (company dinners) and gatherings, complete with rituals around who mixes it and endless debates over the perfect ratio. Being the person who 'mixes somaek well' is a genuine, jokingly-praised social skill.",
    "literal": "A blend of soju (소주) and maekju (맥주, beer).",
    "usage": "You'll see somaek in office dramas' company-dinner scenes and in drinking segments on variety shows. Cultural caveat: in traditional etiquette, drinks poured by a senior are hard to refuse, which is exactly the pressure younger Koreans now push back on — declining politely is increasingly accepted, so never assume someone must drink.",
    "related": [
      "jeong",
      "honbap"
    ],
    "category": "culture",
    "example": {
      "ko": "부장님이 소맥을 기가 막히게 말아 주셔.",
      "roman": "Bujangnimi somaegeul giga makhige mara jusyeo.",
      "en": "Our department head mixes an incredible somaek."
    }
  },
  {
    "id": "selca",
    "roman": "Selca",
    "hangul": "셀카",
    "meaning": "The Korean word for a selfie. In fandom, 'selca' specifically evokes the photos idols post on Instagram, Weverse, or Bubble — a fresh selca from your bias is a minor fan holiday. It also powers fan events like 'Selca Day,' when fans post their own photo next to their bias's.",
    "literal": "Konglish: a blend of the English words 'self' and 'camera' (셀프 카메라, selpeu kamera).",
    "usage": "Ubiquitous on fan Twitter/X and in idol social-media posts; hashtags like #BiasSelcaDay come from this word. No politeness risk. Revised Romanization would be 'selka,' but fans overwhelmingly write 'selca.'",
    "related": [
      "ulzzang",
      "photocard",
      "bias"
    ],
    "category": "culture",
    "example": {
      "ko": "공항에서 찍은 셀카 올렸던데 봤어?",
      "roman": "Gonghangeseo jjigeun selka ollyeotdeonde bwasseo?",
      "en": "He posted a selfie he took at the airport — did you see it?"
    }
  },
  {
    "id": "ulzzang",
    "roman": "Ulzzang",
    "hangul": "얼짱",
    "meaning": "Literally 'best face' — a title from early-2000s Korean internet culture for ordinary people famous online for their good looks, crowned through cafe communities and ulzzang photo contests. It also names the associated aesthetic: dewy skin, circle lenses, soft angled selfies. Several actors and idols first built followings as ulzzang before debuting.",
    "literal": "A blend of eolgul (얼굴, face) and jjang (짱, the best).",
    "usage": "Fans mostly meet the word in idols' pre-debut lore and in 'ulzzang makeup' tutorials that circulated internationally in the 2010s. Within Korea it now sounds a bit retro — calling someone an ulzzang today reads as early-2000s nostalgia rather than current slang. Revised Romanization is 'eoljjang,' but 'ulzzang' is the spelling that stuck abroad.",
    "related": [
      "visual",
      "selca"
    ],
    "category": "culture",
    "example": {
      "ko": "그 배우 데뷔 전에 얼짱으로 유명했대.",
      "roman": "Geu baeu debwi jeone eoljjangeuro yumyeonghaetdae.",
      "en": "They say that actor was famous as an ulzzang before he debuted."
    }
  },
  {
    "id": "jjimjilbang",
    "roman": "Jjimjilbang",
    "hangul": "찜질방",
    "meaning": "A Korean bathhouse-and-sauna complex, typically open 24 hours: gender-separated bathing areas plus shared lounges where everyone wears matching cotton uniforms and roams between kiln saunas, ice rooms, snack bars, and nap halls. It's part spa, part social hangout, part budget overnight stay. The full experience includes the iconic 'sheep-head' twisted towel, baked eggs, and a cup of sikhye (sweet rice drink).",
    "literal": "From jjimjil (찜질, heat treatment or sweating therapy) plus bang (방, room).",
    "usage": "A K-drama staple — characters hide out, bond, or nurse breakups there — and a bucket-list stop for visiting fans. Practical caveat: the bathing areas are fully nude and gender-separated, which surprises first-timers; the uniformed common areas are the mixed, social part.",
    "related": [
      "honbap",
      "mukbang"
    ],
    "category": "culture",
    "example": {
      "ko": "주말에 찜질방 가서 계란이랑 식혜 먹자.",
      "roman": "Jumare jjimjilbang gaseo gyeranirang sikhye meokja.",
      "en": "Let's go to the jjimjilbang this weekend and have baked eggs and sikhye."
    }
  },
  {
    "id": "bias",
    "roman": "Bias (Choeae)",
    "hangul": "최애",
    "meaning": "In K-pop fandom English, your bias is your favorite member of a group — the one your eyes track in every performance and whose photocards you hunt down. Korean fans say choeae (최애), 'most loved.' Fans also rank an 'ultimate bias' (ult): their number one across all of K-pop.",
    "literal": "The fandom sense is commonly said to come from English phrases like 'I'm biased toward him'; the Korean choeae (최애) is Sino-Korean for 'most love.'",
    "usage": "One of the first words every new K-pop fan learns; it's all over fan Twitter/X, TikTok, and trading posts ('looking for my bias's photocard'). No politeness risk — just note that in this sense 'bias' carries none of the negative English meaning, which confuses newcomers.",
    "related": [
      "bias-wrecker",
      "photocard",
      "visual"
    ],
    "category": "fandom",
    "example": {
      "ko": "제 최애는 데뷔 때부터 한 번도 안 바뀌었어요.",
      "roman": "Je choeaeneun debwi ttaebuteo han beondo an bakkwieosseoyo.",
      "en": "My bias hasn't changed once since debut."
    }
  },
  {
    "id": "bias-wrecker",
    "roman": "Bias Wrecker (Chaae)",
    "hangul": "차애",
    "meaning": "The group member who keeps threatening to steal your bias's spot — every time they do something charming, your loyalty 'wrecks' a little. Korean fans call their number two the chaae (차애, 'second most loved'); 'bias wrecker' itself is an English-fandom coinage with no exact Korean equivalent. The eternal fan struggle is a bias wrecker slowly staging a coup.",
    "literal": "Fandom English 'bias' + 'wrecker'; the Korean chaae (차애) is Sino-Korean for 'next/second love.'",
    "usage": "Standard fandom vocabulary in comment sections and reaction videos ('he's such a bias wrecker'). Purely playful — there's no politeness pitfall, and complaining about your bias wrecker is a bonding ritual among fans.",
    "related": [
      "bias",
      "visual"
    ],
    "category": "fandom",
    "example": {
      "ko": "요즘 차애가 자꾸 최애 자리를 위협해.",
      "roman": "Yojeum chaaega jakku choeae jarireul wihyeophae.",
      "en": "Lately my bias wrecker keeps threatening my bias's spot."
    }
  },
  {
    "id": "sasaeng",
    "roman": "Sasaeng",
    "hangul": "사생",
    "meaning": "An obsessive follower who invades an idol's private life: chasing their cars, loitering outside dorms, buying leaked flight details and phone numbers, even breaking into homes. Sasaengs are not an intense 'fan type' to aspire to — they are condemned by fandoms and by idols themselves, and their behavior has led to police involvement and public pleas from artists. The word carries a genuinely dark connotation in K-pop discourse.",
    "literal": "Short for sasaeng-paen (사생팬), 'private-life fan,' from sasaenghwal (사생활, private life).",
    "usage": "Fans encounter the term in news stories about stalking and in idols' own on-camera complaints about invasive calls. Never use it jokingly about yourself or another fan — calling someone a sasaeng is an accusation of stalking-level harassment, not a way to say 'big fan.'",
    "related": [
      "bias",
      "comeback"
    ],
    "category": "fandom",
    "example": {
      "ko": "사생들 때문에 멤버들이 숙소를 옮겼대.",
      "roman": "Sasaengdeul ttaemune membeodeuri suksoreul omgyeotdae.",
      "en": "They say the members moved dorms because of sasaengs."
    }
  },
  {
    "id": "comeback",
    "roman": "Comeback",
    "hangul": "컴백",
    "meaning": "In K-pop, a comeback is any new release plus its promotion cycle — new album or single, music video, and weeks of music-show stages — even if the group last released music only a few months ago. It does not imply a return from scandal, retirement, or a long hiatus, which trips up newcomers used to the English sense. A group's year is measured in comebacks.",
    "literal": "The English word 'comeback' (컴백, keombaek), repurposed in Korean entertainment for returning to active promotions with new material.",
    "usage": "Core fandom vocabulary: comeback teasers, comeback showcases, 'comeback stage' on shows like Music Bank and Inkigayo. The only caveat is semantic — if you tell non-K-pop friends a group is 'making a comeback,' clarify that nothing bad happened; they just have new music.",
    "related": [
      "all-kill",
      "photocard",
      "daesang"
    ],
    "category": "fandom",
    "example": {
      "ko": "티저 떴어! 다음 달에 드디어 컴백이래!",
      "roman": "Tijeo tteosseo! Daeum dare deudieo keombaegirae!",
      "en": "The teaser dropped! They're finally having a comeback next month!"
    }
  },
  {
    "id": "all-kill",
    "roman": "All-Kill",
    "hangul": "올킬",
    "meaning": "When a song hits number one on all of Korea's major domestic streaming and download charts (Melon, Genie, Bugs, and others) at the same time. Fandoms track it obsessively on release day, and a 'Certified All-Kill' (CAK) — verified by the chart aggregator iChart — is treated as proof of a domestic smash hit. It measures Korean general-public reception, which is why fandoms prize it alongside global numbers.",
    "literal": "Konglish, from the English words 'all' + 'kill' — sweeping every chart at once.",
    "usage": "You'll see it in fan celebration posts and K-media headlines every comeback season, often as 'CAK' or 'Perfect All-Kill' (PAK, an even stricter version including realtime charts). Purely a chart term — no social or politeness pitfalls.",
    "related": [
      "comeback",
      "daesang"
    ],
    "category": "fandom",
    "example": {
      "ko": "신곡이 하루 만에 올킬 달성했어!",
      "roman": "Singogi haru mane olkil dalseonghaesseo!",
      "en": "The new song achieved an all-kill within a day!"
    }
  },
  {
    "id": "daesang",
    "roman": "Daesang",
    "hangul": "대상",
    "meaning": "The grand prize — the highest honor at Korean year-end award ceremonies like MAMA, the Golden Disc Awards, and the Melon Music Awards, typically given for artist, album, or song of the year. It sits above the bonsang (본상, 'main prize') tier that multiple artists receive. Winning a first daesang is a milestone fandoms campaign for and idols often cry over on stage.",
    "literal": "Sino-Korean 大賞: dae (great) + sang (prize) — 'grand prize.'",
    "usage": "Every December, fan feeds fill with daesang predictions, voting drives, and tearful acceptance-speech clips. Know the tier system so you don't mix them up: a bonsang is an honor, but 'they won a daesang' is a much bigger claim.",
    "related": [
      "all-kill",
      "comeback"
    ],
    "category": "fandom",
    "example": {
      "ko": "올해 대상은 무조건 우리 애들이지.",
      "roman": "Olhae daesangeun mujogeon uri aedeuriji.",
      "en": "This year's daesang is definitely going to our kids."
    }
  },
  {
    "id": "visual",
    "roman": "Visual",
    "hangul": "비주얼",
    "meaning": "In K-pop, the visual is an actual position in a group's lineup — alongside leader, main vocalist, and maknae — held by the member considered to best fit Korean beauty ideals and to serve as the group's 'face' in photos and CFs. It's an official-ish designation from the agency or fandom consensus, not an insult to the other members. In everyday Korean, bijueol also just means 'looks,' as in praising a dish's presentation.",
    "literal": "The English word 'visual' (비주얼, bijueol), used in Korean as a noun for appearance or looks.",
    "usage": "You'll see it on member profiles, fan wikis, and in phrases like 'visual of the group' or 'visual shock.' The Korean tag is bijueol damdang (비주얼 담당, 'in charge of visuals'). Newcomer caveat: calling one member the visual is standard position talk, but debating who 'deserves' it is classic fan-war bait.",
    "related": [
      "ulzzang",
      "bias"
    ],
    "category": "fandom",
    "example": {
      "ko": "이 그룹 비주얼 담당은 실물이 더 잘생겼대.",
      "roman": "I geurup bijueol damdangeun silmuri deo jalsaenggyeotdae.",
      "en": "They say this group's visual is even more handsome in person."
    }
  },
  {
    "id": "photocard",
    "roman": "Photocard",
    "hangul": "포토카드",
    "meaning": "A small collectible photo card of a group member, randomly included in K-pop albums — the single biggest driver of fans buying multiple copies. A whole economy has grown around them: trading posts, top-loader protectors, pre-order benefit (POB) exclusives, and rare cards reselling for serious money. Pulling your bias's card from a fresh album is one of fandom's small ecstasies.",
    "literal": "Konglish from English 'photo' + 'card' (포토카드, potokadeu), shortened by fans to poka (포카); random album photocards are commonly credited to Girls' Generation's 2010 album 'Oh!' for popularizing the format.",
    "usage": "Fans encounter photocards in album unboxings, trading threads ('WTT/WTS poka'), and cup-sleeve events at cafes. No politeness risk, but learn the trading etiquette — condition grading and 'ot lines' matter — before jumping into Korean or international trading communities.",
    "related": [
      "bias",
      "comeback",
      "selca"
    ],
    "category": "fandom",
    "example": {
      "ko": "앨범 깠는데 최애 포카가 나왔어!",
      "roman": "Aelbeom kkanneunde choeae pokaga nawasseo!",
      "en": "I opened the album and pulled my bias's photocard!"
    }
  }
];

export const slangMap: Record<string, SlangEntry> = Object.fromEntries(
  slangEntries.map((e) => [e.id, e])
);

export function getSlang(id: string): SlangEntry | undefined {
  return slangMap[id];
}

export function slangByCategory(cat: SlangCategoryId): SlangEntry[] {
  return slangEntries.filter((e) => e.category === cat);
}
