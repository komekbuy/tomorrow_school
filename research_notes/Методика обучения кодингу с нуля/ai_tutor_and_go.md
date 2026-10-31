# AI-тьютор для абсолютного новичка и первые конструкции Go (research notes)

Scope: (a) evidence and design rules for LLM tutoring of novice programmers; (b) beginner-proof teaching cards for core Go; (c) one fully worked lesson on `data, err := os.ReadFile(input)` + `if err != nil { ...; return }`. Learner: adult, zero code before July 2026, 4-week Go Piscine (01-edu), 3-month break, main program since 27 Oct 2026, learns via a Russian-speaking LLM tutor, prefers practice, does not read long texts. **Every Go output, compiler message and runtime message quoted below was produced by actually running the code with go1.26.5 darwin/arm64 on 2026-10-31 (marked ✔run).** The learner's real program is `/Users/komekbuy/Projects/tomorrow_school/sandbox/go-refresh-mini/main.go` (copy tool: `os.Args` check → `os.ReadFile` → `if err != nil` → `string(data)` → `err = os.WriteFile(output, []byte(text), 0644)` → second check). Evidence part is in English; tutor scripts are in Russian.

---

## 1. Evidence on LLM tutors and novices: which interaction patterns and guardrails produce learning?

### Takeaway
The same LLM raises or lowers learning depending on design and on what the learner does with it. Unrestricted answer-giving lifts practice scores but lowers later unassisted performance (−17% in Bastani et al.) and inflates perceived learning; structured tutors that follow an expert-designed step sequence, are grounded in verified solutions and keep the learner doing the thinking produced roughly double the learning gains of in-class active learning (Kestin et al.) or neutralised the harm (GPT Tutor). The strongest observed predictor of mastery is the learner's usage pattern: "generate, then interrogate until understood", "code + explanation" and conceptual questions scored 65–86% vs <40% for delegation and AI-debugging loops (Anthropic RCT). Low-prior-knowledge novices are hurt most and overestimate their understanding (Prather; Lehmann). Pure Socratic withholding has an engagement cost (Khanmigo trial). For this learner: full solutions are acceptable as worked examples, but moving on must be gated by prediction, explanation in his own words, modification and rewriting from memory — the gate that was missing on 31.10.

### Cited Findings

**Structured AI tutor vs in-class active learning — Kestin, Miller et al., Scientific Reports 15:17458 (June 2025)**
- Design: Harvard Physical Sciences 2 (intro physics for life sciences), Fall 2023, 194 eligible students; randomized crossover — each peer group did one AI-tutored lesson at home and one in-class active-learning lesson (surface tension, fluid flow), with pre/post tests — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/)
- Results: post-test median 4.5 (AI, N=142) vs 3.5 (in class, N=174), pre-test median 2.75; AI gains "over double"; Mann–Whitney p < 10⁻⁸; effect size 0.63 by linear regression (called an underestimate due to ceiling), 0.73–1.3 SD by quantile regression — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/)
- Time and affect: AI median time 49 min (~70% under 60 min; time did not correlate with score); engagement 4.1 vs 3.6, motivation 3.4 vs 3.1; 83% rated AI explanations at least as good as human instructors' — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/)
- Design principles built into the tutor: active learning, cognitive-load management, growth mindset, scaffolding, accuracy, timely targeted feedback, self-pacing — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/)
- The prompt alone could not keep multi-part problems in order, so "the AI platform was designed to guide students sequentially through each part of each problem"; to limit hallucination they supplied pre-written step-by-step solutions: "we avoided relying solely on GPT-4 to generate solutions" — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/)
- Limits stated: one course, low stakes, first exposure to material, accuracy depended on pre-written answers, months of development; "we do not presume that structured AI tutoring will always outperform in-class active learning in all contexts" — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/)

**Guardrails vs unrestricted GPT-4 — Bastani et al., PNAS 122(26), 2025**
- Field experiment with nearly a thousand high-school math students; "GPT Base" (standard ChatGPT-like interface) vs "GPT Tutor" (prompts designed to safeguard learning) — [PNAS abstract via RePEc](https://ideas.repec.org/a/nas/journl/v122y2025pe2422633122.html)
- With access during practice: +48% grades (Base), +127% (Tutor). After access was removed: Base students scored 17% lower than students who never had access; "These negative learning effects are largely mitigated by the safeguards in GPT Tutor"; "Without guardrails, students attempt to use GPT-4 as a 'crutch'" — [PNAS abstract via RePEc](https://ideas.repec.org/a/nas/journl/v122y2025pe2422633122.html)
- Setting Turkey; GPT Tutor "includes teacher input and is designed to guide students with hints rather than directly giving answers"; AI users were "overly optimistic about their learning capabilities" — [Wharton Knowledge](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education/)

**How the learner uses AI decides mastery — Anthropic RCT, Jan 2026**
- 52 mostly junior engineers learning the unfamiliar Python library Trio; AI group quiz 50% vs 67% hand-coding (Cohen's d = 0.738, p = 0.01); speed gain ~2 min, not significant; largest gap on debugging questions — [Anthropic](https://www.anthropic.com/research/AI-assistance-coding-skills)
- Low-scoring patterns (<40%): AI delegation, progressive AI reliance, iterative AI debugging. High-scoring (≥65%): generation-then-comprehension (~86%), hybrid code-explanation (~68%), conceptual inquiry (~65%, second-fastest). Patterns are associations, not causes; n per pattern 2–7 — [Anthropic](https://www.anthropic.com/research/AI-assistance-coding-skills)
- The no-AI group hit more errors; resolving them independently is believed to have built debugging skill: "the ability to understand when code is incorrect and why it fails may be a particular area of concern" — [Anthropic](https://www.anthropic.com/research/AI-assistance-coding-skills)

**Substitute vs complement — Lehmann, Cornelius, Sting, "AI Meets the Classroom" (arXiv 2409.09047, v2 2025)**
- 45-minute Python learning phase; Study 2 n=107 (no copy-paste), Study 3 n=69 (copy-paste allowed), field study n=113; no significant overall effect of LLM access in the lab — [arXiv](https://arxiv.org/html/2409.09047v2)
- Asking for solutions (substitution) lowered post-test performance (−0.312, p<0.01, controlling for progress); asking for explanations (complement) raised it (+0.249, p<0.05); solution users covered 1.7 more questions while learning but solved 1.4 fewer on the post-test — [arXiv](https://arxiv.org/html/2409.09047v2)
- Low-pre-test treated subjects understood significantly less than controls (p=0.043); "LLMs appear to increase inequality in education"; LLMs raised perceived learning beyond actual learning (+0.338, p<0.05); enabling copy-paste raised solution requests (+3.066) — [arXiv](https://arxiv.org/html/2409.09047v2)

**Novices + GenAI: metacognition and illusion of competence — Prather et al., ICER 2024 "The Widening Gap"**
- 21 intro-C++ novices, observation + eye tracking + interviews; 20/21 finished the task, but 11 accelerated and 10 struggled; new GenAI-specific metacognitive difficulties: Interruption, Mislead, Progression ("conceptually behind but unaware of it") — [arXiv](https://arxiv.org/html/2405.17739v1)
- "most of these ten who struggled thought they understood more than they actually did"; strugglers accepted Copilot suggestions more often (34.1% vs 24.5%); accelerators used AI only for code they already intended to write — [arXiv](https://arxiv.org/html/2405.17739v1)
- Recommendations: scaffold GenAI use "by lowering the metacognitive demand", teach metacognition explicitly, use tools that scaffold without giving answers (CodeHelp, CodeAid, etc.) — [arXiv](https://arxiv.org/html/2405.17739v1)
- Even without AI: "One third of the students struggled to explain their own program code" (just-submitted programs); answering questions about one's own code correlated more strongly with success and retention than submitting a correct program — Lehtinen, Lukkarinen, Haaranen, ITiCSE 2021, [arXiv](https://arxiv.org/abs/2104.06710)

**Full code + mandatory manual work, and code-free assistants**
- Kazemitabaar et al., CHI 2023: 69 novices aged 10–17, 45 Python authoring tasks, half with Codex, each followed by a manual code-modification task; Codex group 1.15× completion and 1.8× authoring scores, no decrease on manual modification; one week later the Codex group performed slightly better on retention tests; higher-pre-test learners benefited more — [arXiv](https://arxiv.org/abs/2302.07427v1), [U of T news](https://web.cs.toronto.edu/news-events/news/ai-code-generators-for-programming-education)
- CodeAid (Kazemitabaar et al., CHI 2024): deployed to ~700 students for 12 weeks; answers conceptual questions, gives pseudo-code with line-by-line explanations and annotates incorrect student code with fix suggestions "without revealing code solutions"; 8,000 uses analysed — [arXiv](https://arxiv.org/abs/2401.11314)

**CS50 duck — Liu, Zenke, Liu, Holmes, Thornton, Malan, SIGCSE 2024**
- Tools: "Explain Highlighted Code", style50 explanations, CS50 Duck chatbot; built-in "pedagogical guardrails" to guide "students toward solutions rather than offer them outright"; motivation: some AI tools were "too helpful to students, particularly novices" — [PDF](https://cs.harvard.edu/malan/publications/V1fp0567-liu.pdf)
- System prompt + RAG over lecture captions; throttling: 10 hearts, one regained every 3 minutes, intended to make students "carefully consider their questions" and take reflective breaks — [PDF](https://cs.harvard.edu/malan/publications/V1fp0567-liu.pdf)
- Outcomes are self-report/usage only: mid-semester (≈500 students) 47% "very helpful", 26% helpful, 21% somewhat, 6% not; accuracy audit on Ed: 22/25 (88%) curricular answers correct, 30/39 (77%) administrative; authors note AI shows "complete and authoritative confidence even when wrong" — [PDF](https://cs.harvard.edu/malan/publications/V1fp0567-liu.pdf)
- Follow-up "Improving AI in CS50" (SIGCSE TS 2025) reportedly found the duck did not always follow instructions not to give direct answers (per search summary; full text not read) — [PDF](https://cs.harvard.edu/malan/publications/fp0627-liu.pdf)

**Socratic-only tutoring and engagement — Khanmigo**
- Two-year cluster RCT in 18 Tennessee middle schools (Oreopoulos & Low, NBER WP 35620); Khanmigo configured to coach rather than give answers — [RePEc/NBER](https://ideas.repec.org/p/nbr/nberwo/35620.html), [Hechinger Report](https://hechingerreport.org/proof-points-khanmigo-math-ai-tutor/)
- 96% tried it, but the median student messaged it on only a third of practice days; messages were mostly bare answers or clicks on suggested prompts; gains modest and no greater than earlier Khan Academy practice without AI; "the binding constraint appears to be engagement" (draft paper, as reported) — [Hechinger Report](https://hechingerreport.org/proof-points-khanmigo-math-ai-tutor/), [KQED: "Students didn't get answers from Khanmigo. They didn't want its questions either"](https://www.kqed.org/mindshift/66662/students-didnt-get-answers-from-khanmigo-they-didnt-want-its-questions-either)

**AI that nudges a human tutor toward questions — Tutor CoPilot (Wang, Ribeiro, Robinson, Loeb, Demszky 2024)**
- Students of tutors with access were 4 percentage points more likely to master topics (p<0.01); students of lower-rated tutors +9 pp; tutors with access asked more guiding questions and were less likely to give away answers; cost ~$20 per tutor per year; sample sizes differ by version (≈700–900 tutors, ≈1,000–1,800 students) — [arXiv](https://arxiv.org/abs/2410.03017), [EdWorkingPapers](https://edworkingpapers.com/ai24-1054), [J-PAL](https://www.povertyactionlab.org/print/pdf/node/8137812?lang=en)

**Pedagogy principles for LLM tutors — Google LearnLM (2024)**
- Principles: inspire active learning, manage cognitive load, adapt to the learner, stimulate curiosity, deepen metacognition — [Google blog](https://blog.google/outreach-initiatives/education/google-learnlm-gemini-generative-ai/)
- Reviewers of the technical report flag that LLMs tend to produce long-form answers, which are not ideal in multi-turn tutoring (secondary) — [Substack review](https://garyliang.substack.com/p/google-learnlm-technical-paper)

**Hints, bottom-out hints and help abuse (pre-LLM tutoring research)**
- "Help abuse" (requesting hints without needing them, a form of gaming the system): in one Geometry Cognitive Tutor study students abused hints on 36% of actions (14% counting rapid successive requests as one) — [LearnLab wiki](https://learnlab.org/research/wiki/index.php/Help_abuse)
- Shih, Koedinger & Scheines (EDM 2008, best paper): bottom-out hints (the full answer) can function as worked examples when students spend time reflecting on them; they model response time to separate good from bad use — [PDF](https://www.cmu.edu/dietrich/philosophy/docs/scheines/Shih_Koedinger_Scheines_2008_EDM.pdf)
- VanLehn 2011 meta-analysis: step-based tutoring (~0.76 SD) nearly as effective as human tutoring (~0.79) vs no tutoring — figures from secondary sources; VanLehn's keynote summarises both as ~0.75 — [Marginal Revolution](https://marginalrevolution.com/marginalrevolution/2013/10/how-good-are-computers-as-tutors.html), [ICCE 2011 keynote](https://www.nectec.or.th/icce2011/speakers/keynoteSpeakers.php)

**Explaining code predicts writing code; cheaper practice formats**
- Ability to "Explain in Plain English" is linked to code-writing proficiency in novices (Murphy, Fitzgerald, Lister, McCauley, ICER 2012) — [UTS record](https://opus.lib.uts.edu.au/citation/handle/10453/22969); strong correlation replicated for data-structures problems (SIGCSE 2014) — [UTS](https://opus.lib.uts.edu.au/handle/10453/33408)
- Parsons problems (reorder given lines): same pre→post learning gains as fixing or writing code, completed significantly faster (Ericson, Margulieux, Rick, Koli Calling 2017) — [Georgia Tech](https://hg.gatech.edu/node/603172)

### Inferences — design rules for the Russian-speaking AI tutor

**R1. «Решение сразу» можно — «идём дальше» только через гейт.** A full solution is a worked example, not completion. Gate before moving on: (1) он предсказывает вывод, (2) объясняет каждую строку своими словами, (3) делает маленькую модификацию, (4) пишет с нуля без подсказки (лучше на следующий день). Basis: Codex + manual modification did no harm (Kazemitabaar); "generation-then-comprehension" ~86% vs delegation <40% (Anthropic); bottom-out answers teach only if reflected upon (Shih); one third can't explain even their own code (Lehtinen). This keeps the learner's own 08.08 method (solution first) but adds the missing step. **What failed on 31.10:** program given → retyped → tutor moved on; no prediction, no line-by-line explanation, no modification. Retyping is friction, not understanding.

**R2. Никогда не принимать «понял» как доказательство.** Self-assessment is inflated by AI use (Prather; Lehmann +0.338; Bastani "overly optimistic"). Replace «Понятно?» with one predict/explain question: «Что напечатает, если файла нет?»

**R3. Предсказание перед каждым запуском.** Tutor shows code → «Сначала предскажи вывод (можно "не знаю, но думаю…")» → waits → runs → compares. (PRIMM; tracing = predicting state and output, Xie et al. — see §2.)

**R4. Одна новая идея на сообщение; ≤ 8–10 строк текста; ровно один вопрос в конце; ждать ответа.** (Cognitive-load principle in Kestin and LearnLM; LLM verbosity risk; learner does not read long texts.)

**R5. Сначала запусти — потом утверждай.** The tutor runs every snippet (or uses pre-verified outputs) before stating output or an error message; never paraphrase compiler errors from memory. (Kestin pre-written solutions; CS50 88% curricular accuracy and confident wrong answers; Prather "Mislead".)

**R6. Ошибки — материал урока.** Every lesson has planned «сломай» steps; on any error the first question is «Что пишет компилятор? Какая строка?» before any explanation. (Debugging is the biggest AI-related gap — Anthropic.)

**R7. Лестница подсказок — для практики уже объяснённого, не для новой темы:**
```
Уровень 0  «Что ты уже попробовал? Что, по-твоему, делает строка N?»
Уровень 1  ГДЕ: «Проблема в строке 18» (не говоря КАК)
Уровень 2  ЧТО за понятие: «Здесь нужна проверка ошибки — что возвращает ReadFile?»
Уровень 3  Каркас с пропусками ___ или Parsons (строки решения вперемешку)
Уровень 4  Полное решение → обязательный гейт R1
```
Next rung only after an attempt on the current one; frustration protocol (§2) may jump to rung 4, but the gate still applies. (Help abuse 36% of actions; bottom-out hints work only with reflection.)

**R8. Новый синтаксис — объяснять прямо, а не выпытывать.** Socratic questions are for checking and retrieval, not for "discovering" syntax never seen. (Khanmigo engagement problem; worked-example effect for novices — §2.) Questions should be answerable in one line (predict / choose / fill a blank).

**R9. Политика полного решения:**

| Ситуация | Полное решение? | Что потом |
|---|---|---|
| Новая конструкция, раньше не видел | Да (worked example) | PRIMM-цикл по ней |
| «Решение одно-единственное» (его правило 08.08) | Да | Гейт R1 |
| Практика уже объяснённого | Нет → лестница R7 | Разбор после |
| Подготовка к экзамену / таймер | Нет | Разбор ошибок после |
| Признаки фрустрации после ≥2 попыток | Да | Шаг меньше + гейт позже |
| Отладка его собственного кода | Сначала уровни 0–2 | Чинит сам |

**R10. Раз в неделю — режим экзамена без ИИ** (30 мин, бумага/терминал). Performance with AI ≠ performance without (Bastani +48% → −17%).

**R11. Код не копировать — но и перепечатка не равна пониманию.** Copy-paste increased solution-seeking (Lehmann +3.07 requests); retyping adds friction, but only R1 builds understanding.

**R12. Журнал открытых гейтов** (`wiki/weak-spots.md`): every session opens with 2–3 retrieval questions from it (spacing/retrieval, §2).

**R13. Финальный гейт — объяснить соседу** (2 минуты, как на аудите). EiPE correlates with writing ability (Murphy et al.); matches oral peer audits.

**R14. План словами до кода:** «Скажи по-русски по шагам, что программа должна сделать» — explicit metacognitive scaffolding (Prather's recommendation).

### Gaps
- No RCT found on LLM tutoring of adult absolute beginners learning Go, or in Russian; evidence comes from physics (Kestin), high-school math (Bastani, Khanmigo), Python/C/C++ (Lehmann, Prather, Kazemitabaar, CodeAid) and experienced developers (Anthropic).
- Kestin's full system prompt is in Supplementary Material 1 and was not read; secondary summaries say the tutor was told not to simply give answers, but the main text lists the answer-revealing policy as an open question — unverified.
- CS50 duck reports satisfaction/usage and accuracy, not learning outcomes.
- No direct comparison found of "solution-first + forced explanation" vs "attempt-first" with LLMs for novices over weeks.
- No study found on whether retyping code (vs copy-paste) improves learning.
- VanLehn effect sizes taken from secondary sources; PNAS full text was blocked (403), so Bastani details beyond the abstract (session counts, GPT-4 error rate) were not verified.

---

## 2. How to explain to a zero-background learner (concrete before abstract, notional machine, analogies, prerequisites, frustration, attention, practice, restart after a 3-month break)

### Takeaway
Teach the "notional machine" explicitly — what is in memory and what the computer does line by line — and train reading/tracing before writing. Use tiny runnable programs with one new element each, in a Predict→Run→Investigate→Modify→Make cycle. Worked examples suit novices (the effect reverses as expertise grows), especially with prompted self-explanation and subgoal labels. Analogies are temporary scaffolds: the "box" metaphor helps the first assignment but breeds the "variable holds several values" misconception, so name each analogy's breaking point. Confusion turns into frustration and then boredom if impasses stay unresolved, so resolve them fast. After a long break, start with retrieval (a no-AI diagnostic), not re-lecturing: relearning is faster than first learning, and retrieval beats rereading.

### Cited Findings
- Notional machine: du Boulay's term for an idealised computer whose properties are implied by the language's constructs; Sorva adds it should model runtime behaviour and be an explicit learning objective; faulty notional machines are believed to cause many misconceptions — Sorva, ACM TOCE 2013 [DOI](https://doi.org/10.1145/2483710.2483713); definitions as summarised in [Aglić Čuvić seminar](https://www.pmfst.unist.hr/istrazivanje-u-edukaciji/wp-content/uploads/2019/09/seminar_i_marin_aglic_cuvic.pdf)
- Xie et al. 2019 (Computer Science Education): four skills taught in order — tracing (semantics), writing correct syntax, recognising templates, applying templates; tracing defined as looking at code and predicting state changes and outputs; "read before write" — [PDF](https://faculty.washington.edu/ajko/papers/Xie2019IntroCSTheoryOfInstruction.pdf), [summary](https://medium.com/bits-and-behavior/improving-intro-cs-by-explicitly-teaching-programming-skills-20641f920fa9)
- PRIMM (Predict–Run–Investigate–Modify–Make; Sentance, Waite, Kallia 2019): evaluated in 13 schools with ~500 students aged 11–14 over 8–12 weeks with a control group; grounded in sociocultural theory (language, talk about code); reported beneficial to learners' progress (primary statistics not verified here) — [QMUL record](https://qmro.qmul.ac.uk/xmlui/handle/123456789/57800?show=full), [Cambridge talk](https://talks.cam.ac.uk/talk/index/124027)
- Box vs label metaphors (Hermans et al. 2018, 496 participants: 322 children, 174 parents): box group better on simple one-assignment questions (e.g., 77.9% vs 69.4%, p=0.033) but more likely to hold the "multiple values" misconception for strings (p=0.012); a new misconception appeared — novices *add* values on reassignment (arithmetic pattern); "programming educators should use metaphors with care" — [PDF](https://www.felienne.com/wp-content/uploads/2018/08/box-label-vars.pdf)
- Same paper: the assignment-direction misconception (`temperature = 5` read as `5 = temperature`) is attributed to school maths — [PDF](https://www.felienne.com/wp-content/uploads/2018/08/box-label-vars.pdf)
- Code phonology (Hermans, Swidan, Aivaloglou 2018): novices pronounce code inconsistently; reading aloud may direct attention to details that aid comprehension — [TU Delft](https://repository.tudelft.nl/file/File_740ad2d9-2dac-4786-9f1a-1ad8083ddcf7); a controlled study with 49 children (Swidan & Hermans 2019) tested reading code aloud (results not verified here) — [VU](https://research.vu.nl/en/publications/the-effect-of-reading-code-aloud-on-comprehension-an-empirical-st/)
- Expertise reversal: "the relative effectiveness of instructional methods reverses as learner knowledge in a domain changes"; low-knowledge learners learn most from worked examples — Kalyuga 2007, [PDF](https://www.uky.edu/~gmswan3/EDC608/Kalyuga2007_Article_ExpertiseReversalEffectAndItsI.pdf), [Springer](https://link.springer.com/article/10.1007%2Fs10648-007-9054-3)
- Subgoal-labelled worked examples (labels naming what each step achieves): in a 265-student study they seemed especially effective for students at risk of failing or withdrawing — [IJ STEM Ed 2020 via DOAJ](https://doaj.org/article/9a2c85d66fd54ec9ab019e9a510bbf17), [Raspberry Pi Foundation seminar PDF](https://www.raspberrypi.org/app/uploads/2020/07/Using-subgoal-labels-to-reduce-cognitive-load-in-introductory-programming.pdf)
- Affect while learning Python (Bosch, D'Mello & Mills 2013): engagement/flow 23%, confusion 22%, frustration 14%, boredom 12% (shares of reported affect states) — [UMN record](https://experts.umn.edu/en/publications/what-emotions-do-novices-experience-during-their-first-computer-p/); confusion and frustration followed errors and preceded hint use; unresolved impasse → confusion → frustration → boredom (affect-transition model, per secondary summaries) — [SCITEPRESS](https://www.scitepress.org/Papers/2017/63758/63758.pdf), [LAK 2026 paper](https://learninganalytics.upenn.edu/ryanbaker/lak2026-10.pdf)
- Relearning savings: Murre & Dros (PLOS ONE 2015) replicated Ebbinghaus's forgetting curve with the method of savings (relearning after 20 min to 31 days) — [PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0120644)
- Retrieval practice: in Roediger & Karpicke's experiments, students who practised recall retained 61% after one week vs 40% for rereaders (secondary figure) — [summary](https://yukaichou.com/gamification-analysis/retrieval-practice-testing-effect-roediger-karpicke-learning/); most studies find spaced retrieval better than massed — [Matuschak notes](https://notes.andymatuschak.org/zGfjkW1ociSmSUCLcpbhKjf)
- Print vs return is a known beginner confusion: "many beginning programmers find the distinction between print and return very confusing" (textbook note) — [Runestone FOPP](https://runestone.academy/ns/books/published/fopp/Functions/Printvsreturn.html); a teacher note also flags the belief that statements after `return` still execute — [Runestone CSP](https://runestone.academy/ns/books/published/TeacherCSP/CSPNameNames/noteAfterReturn.html)

### Inferences — how the tutor explains

**2.1 Цикл одной идеи (10–15 минут):**
```
1. Пререквизит: 1 вопрос-предсказание  → не прошёл → шаг назад
2. Программа 3–8 строк с ОДНОЙ новой вещью
3. «Предскажи вывод» → он пишет ответ
4. Запуск → «где совпало, где нет?»
5. Таблица памяти по шагам (он заполняет пропуски)
6. Сломай: одна правка → предскажи ошибку/вывод → запуск
7. Измени: маленькая модификация своими руками
8. «Скажи своими словами» (1–2 предложения)
```

**2.2 Как рисовать «машину» (таблица памяти).** One row per *executed* line (loops: one row per iteration; a function call opens a new box of its variables, crossed out on `return`):
```
ШАГ | СТРОКА                          | ПАМЯТЬ ПОСЛЕ СТРОКИ               | ЭКРАН
1   | data, err := os.ReadFile(...)   | data=[104 105 10]   err=nil       |
2   | if err != nil {                 | nil != nil → false → блок пропуск |
3   | fmt.Println(string(data))       |                                   | hi
```

**2.3 Аналогии — с точкой поломки (говорить обе части сразу):**

| Понятие | Аналогия | Где ломается — сказать вслух |
|---|---|---|
| Переменная | Табличка-имя, прикреплённая к значению (на первом шаге можно «коробка») | В переменной всегда ОДНО значение; новое стирает старое, ничего не складывается |
| `=` | «положить в» | Это не «равно» из математики: `x = x + 1` = «посчитай справа, положи слева» |
| Функция | Автомат: бросил монеты (параметры) → получил стакан (return) | Если функция только печатает, стакана нет — `x := shout(5)` не скомпилируется |
| `data, err` | Окно ЦОНа: выдают документ И справку «отказ/всё ок» | В Go оба значения есть всегда; «уйти домой» (`return`) завершает всю программу только потому, что мы в `main` |
| Срез | Окно/закладка на ряд ячеек | Два среза могут смотреть на ОДИН ряд: изменил через один — видно через другой |
| Указатель | Адрес квартиры на бумажке | Копии бумажки ведут в одну квартиру; пустая бумажка (`nil`) → паника |
| map | Телефонная книга | Порядка нет; нет имени → получаешь 0, а не «нет такого» |
| `nil` | Пустая ячейка, «ничего» | `nil` ≠ 0 и ≠ `""`: пустая строка — это значение |
| `[]byte` | Текст в виде номеров букв | Русская буква = 2 номера: `len("привет")` = 12 |

**2.4 Читать код вслух по-русски — всегда одинаково:**

| Код | Читать | Не читать |
|---|---|---|
| `x := 5` | «создать x и положить 5» | «x равно 5» |
| `x = 7` | «положить 7 в x» | «x равно 7» |
| `x == 7` | «x равно 7? (да/нет)» | — |
| `x != 7` | «x НЕ равно 7? (да/нет)» | — |
| `a && b` | «a И b (оба)» | — |
| `a \|\| b` | «a ИЛИ b (хотя бы одно)» | — |
| `!a` | «не a» | — |
| `s[i]` | «элемент s номер i» | — |
| `s[1:3]` | «кусок s с 1 по 3, 3 не включая» | — |
| `&x` / `*p` | «адрес x» / «то, что лежит по адресу p» | — |
| `err != nil` | «ошибка не пустая = что-то пошло не так» | «ошибка не ноль» |
| `return` | «отдать результат и выйти из функции» | — |

**2.5 Пререквизиты — карта зависимостей.** Before node N, ask one diagnostic question per parent node; if it fails, teach the parent first and say so («мы перескочили шаг — возвращаемся»):
```
запуск программы → переменная/значение → тип (int, string) → := / =
→ функция: вызов, параметры, return → несколько return → []byte ↔ string
→ nil → if + == / != → return в main → идиома ошибки
→ срез и индекс → os.Args → os.ReadFile / os.WriteFile
```

**2.6 Протокол фрустрации.** Signals: короткие ответы, «не понимаю», «бесит», «просто дай код», одна и та же ошибка дважды. Actions: (1) прекратить вопросы; (2) назвать пропуск без обвинений: «Мы пропустили шаг X — это мой промах, возвращаемся на один шаг»; (3) дать ответ + шаг поменьше; (4) быстрая победа — 3-строчная программа, которая работает; (5) гейт по этой теме — позже в сессии или завтра. Basis: confusion→frustration→boredom chain; errors trigger confusion/frustration.

**2.7 Короткое внимание + любовь к практике.** Теория ≤ 3 предложений и всегда привязана к коду; для нового синтаксиса — Parsons-задачи и «заполни пропуск» (same gains, less time); Use–Modify–Create вместо лекции; одно сообщение = один экран.

**2.8 Возврат после 3-месячного перерыва.** Day 1: no-AI diagnostic on paper (15 min) — answers verified ✔run:

| # | Код (внутри `main`) | Ответ |
|---|---|---|
| 1 | `x := 3; x = x + 2; fmt.Println(x)` | `5` |
| 2 | `fmt.Println(7/2, 7%2)` | `3 1` |
| 3 | `s := "Go"; fmt.Println(len(s), s[0])` | `2 71` |
| 4 | `nums := []int{4, 5, 6}; fmt.Println(nums[1], len(nums))` | `5 3` |
| 5 | `for i := 0; i < 3; i++ { fmt.Print(i) }` | `012` |
| 6 | `for i, v := range []string{"a", "b"} { fmt.Println(i, v) }` | `0 a` / `1 b` |
| 7 | `y := 5; fmt.Println(y > 3 && y < 5)` | `false` |
| 8 | `func add(a, b int) int { return a + b }` … `fmt.Println(add(2, 3)*2)` | `10` |
| 9 | `m := map[string]int{"a": 1}; fmt.Println(m["b"])` | `0` |
| 10 | `if 3 != 3 { fmt.Println("A") } else { fmt.Println("B") }` | `B` |
| 11 | `fmt.Println('a', string('a'))` | `97 a` |
| 12 | `z := 10; if z > 5 { z := 1; z++ }; fmt.Println(z)` | `10` (внутри создана НОВАЯ z) |

Then: wrong answers → `weak-spots.md`; days 2–10: each session opens with 5 min of retrieval on 3 old items; new material only after its prerequisites pass; weekly 30-min no-AI simulation. Expect fast relearning (savings) — say so to the learner: «забытое возвращается быстрее, чем училось в первый раз».

### Gaps
- No study found on adults restarting programming after a multi-month break; the protocol extrapolates from general memory research (savings, retrieval, spacing).
- No research found on how Russian vocalisation of operators affects confusions such as `:=`/`=`/`==`; the table is a design inference from code-phonology work.
- PRIMM and subgoal-label effect sizes and the Swidan & Hermans results were not verified from primary full texts.
- The affect-transition chain is cited via secondary summaries.

---

## 3. Go core constructs for absolute beginners (plain explanation, memory picture, runnable example, predict question, typical mistakes)

### Takeaway
Go's first constructs are teachable with 3–8-line programs whose outputs and error messages are fully predictable. The compiler is a teaching ally: it refuses unused variables and imports, extra `:=`, assignment inside `if`, ignored multiple results and missing returns — each produces a short, exact message the learner can be trained to read. The highest-yield points for this learner are: `:=` vs `=` vs `==` vs `!=`; print vs return; "a function can return two values, the second is the error"; `nil` = "no error"; `return` in `main` ends the program; `string` vs `[]byte` (`Println(data)` prints numbers); one-variable `range` gives the index; `&&` for "inside a range", `||` for "outside".

### Cited Findings

**Official definitions (quotes)**
- Short variable declaration "is shorthand for a regular variable declaration with initializer expressions but no types"; it "may redeclare variables provided they were originally declared earlier in the same block … with the same type, and at least one of the non-blank variables is new"; "Short variable declarations may appear only inside functions" — [Go spec](https://go.dev/ref/spec#Short_variable_declarations)
- Effective Go on reuse of `err`: "`err` is declared by the first statement, but only *re-assigned* in the second" (example `f, err := os.Open(name)` … `d, err := f.Stat()`) — [Effective Go](https://go.dev/doc/effective_go#redeclaration)
- Multiple results replace "clumsy idioms in C programs: in-band error returns such as `-1` for `EOF`" — [Effective Go](https://go.dev/doc/effective_go#multiple-returns)
- "The predeclared type error is defined as `type error interface { Error() string }` … with the nil value representing no error" — [Go spec](https://go.dev/ref/spec#Errors)
- Program execution: main is invoked and "When that function invocation returns, the program exits" — [Go spec](https://go.dev/ref/spec#Program_execution)
- "Errors are values." / "Values can be programmed, and since errors are values, errors can be programmed." / "Whatever you do, always check your errors!" — Rob Pike, 2015, [Go blog](https://go.dev/blog/errors-are-values)
- Why no exceptions: try-catch-finally "results in convoluted code" and encourages labelling "ordinary errors, such as failing to open a file, as exceptional"; "Go's multi-value returns make it easy to report an error without overloading the return value" — [Go FAQ](https://go.dev/doc/faq#exceptions)
- Unused variables/imports: "The presence of an unused variable may indicate a bug … Go refuses to compile programs with unused variables or imports" — [Go FAQ](https://go.dev/doc/faq#unused_variables_and_imports)
- Error strings should "identify their origin", e.g. `open /etc/passwx: no such file or directory` — [Effective Go](https://go.dev/doc/effective_go#errors)
- `func ReadFile(name string) ([]byte, error)`: "reads the named file and returns the contents. A successful call returns err == nil, not err == EOF" — [pkg os](https://pkg.go.dev/os#ReadFile)
- `func WriteFile(name string, data []byte, perm FileMode) error`: "creating it if necessary … with permissions perm (before umask); otherwise WriteFile truncates it before writing"; a mid-operation failure "can leave the file in a partially written state" — [pkg os](https://pkg.go.dev/os#WriteFile)
- "Args hold the command-line arguments, starting with the program name" — [pkg os](https://pkg.go.dev/os#Args)
- `os.Exit`: "Conventionally, code zero indicates success, non-zero an error … deferred functions are not run" — [pkg os](https://pkg.go.dev/os#Exit)
- Even `fmt.Println` returns `(n int, err error)` ("any write error encountered") — [pkg fmt](https://pkg.go.dev/fmt#Println) (advanced aside; not for day 1)
- Strings: "a string is in effect a read-only slice of bytes"; "indexing a string accesses individual bytes, not characters"; "rune [is] an alias for the type int32"; "A for range loop … decodes one UTF-8-encoded rune on each iteration" — Rob Pike 2013, [Go blog](https://go.dev/blog/strings); "Strings are immutable" — [Go spec](https://go.dev/ref/spec#String_types)
- Range over string: index = first byte of each code point, value = rune — [Go spec](https://go.dev/ref/spec#For_range)
- Arrays: "The length is part of the array's type"; "Arrays are values. Assigning one array to another copies all the elements" — [Go spec](https://go.dev/ref/spec#Array_types), [Effective Go](https://go.dev/doc/effective_go#arrays); "Slices hold references to an underlying array, and if you assign one slice to another, both refer to the same array" — [Effective Go](https://go.dev/doc/effective_go#slices); "A slice is a descriptor of an array segment"; "Slicing does not copy the slice's data" — [Go blog 2011](https://go.dev/blog/slices-intro)
- Maps: missing key returns "the zero value for the type of the entries"; the `v, ok` form is "the 'comma ok' idiom" — [Effective Go](https://go.dev/doc/effective_go#maps); "The iteration order over maps is not specified"; "A nil map is equivalent to an empty map except that no elements may be added" — [Go spec](https://go.dev/ref/spec#Map_types); `fmt` prints maps in key-sorted order since Go 1.12 — [Go 1.12 release notes](https://go.dev/doc/go1.12#fmt) (release note not re-fetched; behaviour seen ✔run)
- Logical operators: `p && q` is "if p then q else false", `p || q` is "if p then true else q" (right side evaluated only if needed) — [Go spec](https://go.dev/ref/spec#Logical_operators); "the address operation &x generates a pointer of type *T to x" — [Go spec](https://go.dev/ref/spec#Address_operators)
- Modules: `go mod init example/hello` → `go: creating new go.mod: module example/hello`; the go.mod file "tracks the modules that provide those packages"; the official tutorial lists "Some programming experience" as a prerequisite — [Go tutorial](https://go.dev/doc/tutorial/getting-started)

**Exact messages, all ✔run (go1.26.5)** — sources: the compiler/runtime itself; rules per spec/FAQ above.

| Ошибка новичка | Сообщение |
|---|---|
| `y := shout(5)` (функция без результата) | `shout(5) (no value) used as value` |
| `q := divmod(17, 5)` (два результата) | `assignment mismatch: 1 variable but divmod returns 2 values` |
| `x := 5` и потом снова `x := 7` | `no new variables on left side of :=` |
| `y = 3` без объявления | `undefined: y` |
| `data, err := …`, err не используется | `declared and not used: err` |
| `for i, v := range nums`, i не используется | `declared and not used: i` |
| лишний import | `"os" imported and not used` |
| `if x = 7 {` | `syntax error: cannot use assignment x = 7 as value` |
| `x := 5` вне функции | `syntax error: non-declaration statement outside function body` |
| `fmt.println(...)` | `undefined: fmt.println (but have Println)` |
| функция с результатом без `return` | `missing return` |
| `if x == 1 \|\| 2 {` | `invalid operation: x == 1 \|\| 2 (mismatched types untyped bool and untyped int)` |
| `s[0] = 'H'` для string | `cannot assign to s[0] (neither addressable nor a map index expression)` |
| `append(s, 3)` без присваивания | `append(s, 3) (value of type []int) is not used` |
| `birthday(a)`, а параметр `*Student` | `cannot use a (variable of struct type Student) as *Student value in argument to birthday` |
| `os.WriteFile("x.txt", text, 0644)`, text — string | `cannot use text (variable of type string) as []byte value in argument to os.WriteFile` |
| `func Main()` вместо `main` | `function main is undeclared in the main package` |
| массив `a[3]` при длине 3 | `invalid argument: index 3 out of bounds [0:3]` |
| `go run .` без go.mod | `go: go.mod file not found in current directory or any parent directory; see 'go help modules'` |
| `go vet`: код после `return` | `unreachable code` |
| `go vet`: `string(n)`, n — int | `conversion from int to string yields a string of one rune, not a string of digits` |
| `os.Args[1]` без аргументов | `panic: runtime error: index out of range [1] with length 1` |
| `s[4]` при длине 4 | `panic: runtime error: index out of range [4] with length 4` |
| запись в nil-map | `panic: assignment to entry in nil map` |
| `*q`, где q == nil | `panic: runtime error: invalid memory address or nil pointer dereference` |
| ReadFile: файла нет | `open input.txt: no such file or directory` |
| ReadFile: это папка | `read input.txt: is a directory` |
| ReadFile: chmod 000 | `open input.txt: permission denied` |
| WriteFile: папки нет | `open nodir/out.txt: no such file or directory` |
| WriteFile с `644` (без 0) | файл `--w----r--`; потом ReadFile → `open bad.txt: permission denied` |

- Exit codes ✔run: after `fmt.Println("error:", err); return` in `main` the exit code is **0**; with `os.Exit(1)` it is 1 and `go run` prints `exit status 1`; a panic gives `exit status 2`.
- Without `return` after the error check ✔run: program prints the error, continues with empty `data`, and `os.WriteFile` truncates an existing output file to 0 bytes ("IMPORTANT DATA", 15 bytes → 0 bytes).
- Empty input file ✔run: `len(data)` = 0, `data == nil` false, `err == nil` true — an empty file is **not** an error.
- The error value's dynamic type is `*fs.PathError`, and `errors.Is(err, fs.ErrNotExist)` is `true` ✔run (advanced: errors are values you can inspect).

### Inferences — teaching cards (K0–K12, in teaching order)

Format of each card: **Суть** → **Память** → **Пример ✔run** → **Предскажи** → **Ошибки** → **Аналогия/поломка**. All code goes inside `func main()` of `package main` with the needed imports unless shown otherwise.

#### K0. Программа, пакет, `go run`, модуль
- **Суть:** «Программа на Go — папка-модуль. `go.mod` — паспорт: имя модуля и версия Go. Выполнение начинается с первой строки `func main()` в `package main` и идёт сверху вниз; закончилась `main` — закончилась программа. `import "fmt"` — взять готовый набор инструментов; `fmt.Println` — инструмент Println из набора fmt.»
- **Память/структура:**
```
go-refresh-mini/
├── go.mod    "module go-refresh-mini" / "go 1.22"
└── main.go   package main → import → func main() { ... }
```
- **Пример ✔run:** `go mod init hello` → `go: creating new go.mod: module hello`; затем `go run .` → `hello`
```go
package main

import "fmt"

func main() {
	fmt.Println("hello")
}
```
- **Предскажи:** в `main` три строки `fmt.Println("1")`, `("2")`, `("3")` — что и в каком порядке? → `1 2 3` по строкам.
- **Ошибки:** нет go.mod при `go run .`; лишний import; `fmt.println`; `func Main` — точные тексты в таблице выше. `go run main.go` работает и без go.mod ✔run, `go run .` — нет.
- **Аналогия:** пакет = ящик с инструментами. Ломается: заглавная буква (`Println`) = «инструмент виден снаружи ящика» — строчная (`println`) не найдётся.

#### K1. `:=`, `=`, `==`, `!=`
- **Суть:** «`:=` — создать новую переменную и положить значение (только внутри функций). `=` — положить новое значение в уже существующую (старое исчезает). `==` и `!=` — вопросы "равно?" / "не равно?", ответ true/false, ничего не меняют.»
- **Память:**
```
x := 5        x: 5      создали
x = 7         x: 7      перезаписали (5 больше нет)
x == 7        x: 7      только спросили → true
x != 7        x: 7      только спросили → false
```
- **Пример ✔run** (тень переменной):
```go
x := 1
if true {
	x := 2
	fmt.Println(x)
}
fmt.Println(x)
```
→ `2`, затем `1`.
- **Предскажи:** вывод примера и почему → внутри `{}` `:=` создал ВТОРУЮ x; внешняя осталась 1.
- **Ошибки:** повторное `:=` → `no new variables on left side of :=`; `=` без объявления → `undefined: y`; `if x = 7` → `cannot use assignment x = 7 as value`; `:=` вне функции. **В его программе:** строка 17 `data, err :=` создаёт err; строка 25 `err = os.WriteFile(...)` только перезаписывает — `err :=` там дал бы `no new variables on left side of :=`. (`out, err := …` было бы законно: есть новая переменная out.)
- **Аналогия:** `:=` — повесить новую табличку; `=` — заменить то, на что табличка указывает. Ломается: табличка не «коробка с кучей вещей» — значение всегда одно.

#### K2. Функции: параметры, return, печать vs возврат, несколько результатов
- **Суть:** «Функция — мини-программа с именем. Параметры — входящие значения (копии). `return` отдаёт значение туда, где функцию вызвали, и сразу заканчивает функцию. `fmt.Println` показывает человеку на экране — программа это значение "поймать" не может. Проверяющая программа (тесты/экзамен) видит только то, что возвращено.»
- **Память (вызов):**
```
main:   x = ?   ── double(5) ──►  double: n = 5
                                   return 10   (коробка double исчезает)
main:   x = 10  ◄─────────────────
```
- **Пример ✔run:**
```go
func double(n int) int {
	return n * 2
}

func shout(n int) {
	fmt.Println(n * 2)
}

func main() {
	x := double(5)
	fmt.Println(x + 1)
	shout(5)
}
```
→ `11`, `10`.
- **Предскажи:** вывод; затем «что будет при `y := shout(5)`?» → ошибка компиляции `shout(5) (no value) used as value`.
- **Несколько результатов ✔run:** `func divmod(a, b int) (int, int) { return a / b, a % b }`; `q, r := divmod(17, 5)` → `3 2`; `q := divmod(17, 5)` → `assignment mismatch: 1 variable but divmod returns 2 values`. Мост к уроку: `os.ReadFile` — ровно такая функция: `func ReadFile(name string) ([]byte, error)`.
- **Ошибки:** печатать вместо возврата (стоило ему экзамена); и печатать, и возвращать (двойной вывод в тестах); забыть `return` → `missing return`; думать, что строки после `return` выполнятся (`go vet` → `unreachable code`).
- **Аналогия:** автомат с кофе — return = стакан в руки, Println = надпись на табло. Ломается: табло видно человеку, но в руках пусто.

#### K3. `if`, `&&`, `||`, `!`
- **Суть:** «`&&` — И: нужны оба true. `||` — ИЛИ: хватит одного true. "Внутри диапазона" — `&&`; "вне диапазона" — `||`. Go проверяет правую часть только если нужно.»
- **Память (таблица истинности):**
```
a      b      a && b   a || b
true   true   true     true
true   false  false    true
false  true   false    true
false  false  false    false
```
- **Пример ✔run:**
```go
x := 150
fmt.Println(x >= 0 && x <= 100)
fmt.Println(x < 0 || x > 100)
c := '!'
fmt.Println(c >= 'a' || c <= 'z')
fmt.Println(c >= 'a' && c <= 'z')
```
→ `false`, `true`, `true`, `false`.
- **Предскажи:** 3-ю строку для `c := '!'` и почему → любой символ либо ≥'a', либо ≤'z' → с `||` всегда true (баг проверки «это строчная буква?»).
- **Ошибки:** `||` вместо `&&` в проверке диапазона; `x != 1 || x != 2` — всегда true ✔run (для 1, 2, 3); `x == 1 || 2` → `mismatched types untyped bool and untyped int`; `=` вместо `==` в `if`.

#### K4. `error`, `nil`, `if err != nil { …; return }`, `return` в `main`
- **Суть:** «Ошибка в Go — обычное значение, которое функция возвращает вторым. Всё хорошо → там `nil` ("пусто, ошибки нет"). Плохо → там описание, например `open input.txt: no such file or directory`. `if err != nil` = "если что-то пошло не так". `return` в `main` = "закончить main сейчас" = закончить программу; ни одна следующая строка не выполнится.»
- **Почему так (для аудита):** в Go нет try/catch: не открылся файл — это обычная ситуация, а не "исключение"; ошибку возвращают как значение и проверяют обычным `if` (FAQ, "Errors are values").
- **Память — два запуска:**
```
ФАЙЛ ЕСТЬ ("hi\n")                     ФАЙЛА НЕТ
data = [104 105 10]                     data = nil (пусто, len 0)
err  = nil                              err  = "open input.txt: no such file or directory"
if err != nil → false → блок пропущен   if err != nil → true → печать + return → КОНЕЦ
```
- **Пример ✔run:**
```go
data, err := os.ReadFile("nofile.txt")
fmt.Println(len(data), data == nil, err == nil)
fmt.Println(err)
```
→ `0 true false`, `open nofile.txt: no such file or directory`.
- **Предскажи:** то же для существующего файла с `hi` + Enter → `3 false true` и `<nil>`. (Пустой `var err error` печатается как `<nil>` ✔run.)
- **Ошибки:** перевёрнутое `if err == nil { … return }`; забытый `return` (программа идёт дальше и затирает выходной файл — ✔run, см. урок); `data, _ :=` — молчаливая поломка; неиспользованный err → `declared and not used: err` (компилятор заставляет решить, что делать с ошибкой); второй `err :=` вместо `err =`; «nil = 0» (нет: nil — "ничего", у числа нет nil).
- **Код выхода:** после `return` в main код 0 ✔run — система думает, что всё хорошо. Для настоящих консольных утилит — `os.Exit(1)` (`exit status 1` ✔run); для школьных задач — как требует subject.

#### K5. `os.Args`
- **Суть:** «`os.Args` — срез строк: команда запуска, разрезанная по пробелам. `[0]` — сама программа, `[1]` — первое слово после неё. Все элементы — строки: "5" это текст, не число.»
- **Память:**
```
команда:   go run . in.txt out.txt
os.Args:   [0]=длинный временный путь к собранной программе   [1]="in.txt"  [2]="out.txt"     len = 3
```
(✔run: при `go run` элемент `[0]` — путь вида `/var/folders/…/go-build…/exe/arg0` или `~/Library/Caches/go-build/…/args` — имя берётся от папки пакета, не «main».)
- **Пример ✔run** (`go run ./args in.txt out.txt`):
```go
fmt.Println(len(os.Args))
fmt.Println(os.Args[1:])
fmt.Println(os.Args[1])
```
→ `3`, `[in.txt out.txt]`, `in.txt`. Без аргументов → `1`, `[]`, затем `panic: runtime error: index out of range [1] with length 1`.
- **Предскажи:** `go run . a b c` → чему равен `len(os.Args)` и `os.Args[2]`? → `4`, `b`.
- **Ошибки:** забыть, что `[0]` — программа (сдвиг на один); брать `os.Args[1]` без проверки длины → паника — поэтому в его программе первая проверка `if len(os.Args) != 3 { … return }`; ждать число вместо строки.

#### K6. `os.ReadFile`, `os.WriteFile`, права `0644`
- **Суть:** «`os.ReadFile(имя)` читает ВЕСЬ файл и отдаёт два значения: байты и ошибку. `os.WriteFile(имя, байты, права)` создаёт файл или ОЧИЩАЕТ существующий и пишет байты; отдаёт одно значение — ошибку. `0644` (с нулём!) — права: владелец читает+пишет (6=4+2), группа и остальные только читают (4).»
- **Память:**
```
ДИСК    input.txt  "hi\n"
          │ os.ReadFile(input)
ПАМЯТЬ  data = [104 105 10]   err = nil
          │ os.WriteFile(output, data, 0644)
ДИСК    output.txt "hi\n"   -rw-r--r--
```
- **Пример ✔run** (input.txt = `hi` + Enter):
```go
data, err := os.ReadFile("input.txt")
if err != nil {
	fmt.Println("error:", err)
	return
}
fmt.Println("read", len(data), "bytes")
fmt.Println(data)
fmt.Println(string(data))
```
→ `read 3 bytes`, `[104 105 10]`, `hi`.
- **Предскажи:** почему 3, а не 2? → перевод строки — тоже байт (10).
- **Ошибки:** передать string в WriteFile (нужно `[]byte(text)`) → `cannot use text (variable of type string) as []byte value…`; `644` вместо `0644` → файл `--w----r--`, сам потом не прочитаешь ✔run; несуществующая папка → `open nodir/out.txt: no such file or directory`; забыть, что WriteFile затирает существующий файл.

#### K7. `string`, `[]byte`, `rune`
- **Суть:** «Компьютер хранит текст как числа-байты (0–255). `string` — неизменяемая цепочка байтов, которую Go показывает как текст. `[]byte` — те же байты в изменяемом срезе; Println показывает их числами. `rune` — номер одного символа (int32). Латиница — 1 байт, кириллица — 2 байта.»
- **Память:**
```
"hi\n"       байты: [104][105][10]
"aж!"        байты: [97][208][182][33]      ж = 2 байта
range "aж!"  (0,'a'=97) (1,'ж'=1078) (3,'!'=33)   ← индекс 2 пропущен
```
- **Пример ✔run:**
```go
s := "привет"
fmt.Println(len(s), len([]rune(s)))
fmt.Println(s[0], string(s[0]))
for i, r := range "aж!" {
	fmt.Println(i, r, string(r))
}
```
→ `12 6`, `208 Ð`, `0 97 a`, `1 1078 ж`, `3 33 !`. Также `fmt.Println('a', string('a'), []byte("hi"))` → `97 a [104 105]`; файл `привет\n` → 13 байт, 7 рун ✔run.
- **Предскажи:** `len("мир")`? → `6`. Какие индексы даст `range "aж!"`? → `0 1 3`.
- **Ошибки:** `s[i]` — байт, не буква (ломает кириллицу); `len` считает байты; `fmt.Println(data)` печатает числа — нужен `string(data)`; `'a'` (руна, одинарные кавычки) ≠ `"a"` (строка); `s[0] = 'H'` не компилируется (строки неизменяемы); `string(65)` из int → `go vet` предупреждает (получится "A", не "65").

#### K8. Массивы, срезы, индексы, квадратные скобки
- **Суть:** «`[3]int` — массив: ровно 3 ячейки, размер — часть типа. `[]int` — срез: "окно" на массив (адрес начала + длина + вместимость); в Go почти всегда срезы. Индексы от 0 до len−1. Присвоить массив — скопировать; присвоить срез — смотреть на те же данные.»
- **Память:**
```
a := [3]int{1,2,3}   a: [1][2][3]
b := a               b: [1][2][3]        ← КОПИЯ
s := []int{1,2,3}    s: {→[1][2][3], len 3, cap 3}
t := s               t: {→ тот же ряд}    ← ОБЩИЕ данные
```
- **Пример ✔run:**
```go
a := [3]int{1, 2, 3}
b := a
b[0] = 100
s := []int{1, 2, 3}
t := s
t[0] = 100
fmt.Println(a[0], s[0])
fmt.Println(s[1:3], len(s[1:3]))
```
→ `1 100`, `[2 3] 2`.
- **Предскажи:** первую строку и почему разные → массив скопировался, срез общий.
- **Таблица скобок (его путаница):**
```
[]int            тип «срез int»
[3]int           тип «массив из 3 int»
[]int{1,2,3}     создать срез со значениями
s[0]             элемент номер 0
s[1:3]           кусок: 1 и 2 (3 не входит)
map[string]int   тип «словарь string → int»
m["Ali"]         значение по ключу "Ali"
[]byte("hi")     превратить строку в байты
```
- **Ошибки:** `s[len(s)]` → `index out of range [4] with length 4` (паника); у массива константный индекс ловит компилятор → `index 3 out of bounds [0:3]`; `append(s, 4)` без `s =` → `… is not used`; думать, что `t := s` копирует.

#### K9. `for` и `range`
- **Суть:** «В Go один цикл — `for`. Формы: счётчик `for i := 0; i < 3; i++`; пока-условие `for x < 10`; обход `for i, v := range nums` — i = номер, v = КОПИЯ значения. С одной переменной `range` даёт НОМЕР, не значение.»
- **Память (трассировка):**
```
итерация | i | v
1        | 0 | 10
2        | 1 | 20
3        | 2 | 30
```
- **Пример ✔run:**
```go
nums := []int{10, 20, 30}
for i, v := range nums {
	fmt.Println(i, v)
}
for v := range nums {
	fmt.Print(v, " ")
}
```
→ `0 10`, `1 20`, `2 30`, затем `0 1 2`.
- **Предскажи:** второй цикл → `0 1 2` (это индексы!).
- **Ошибки:** ждать значения из `for v := range`; менять `v` и ждать изменения среза (`for _, v := range nums { v = v * 2 }` → nums остаётся `[10 20 30]` ✔run; правильно `nums[i] = nums[i] * 2`); `i <= len(s)` → паника; неиспользуемый `i` → `declared and not used: i` (нужен `_`). Go ≥1.22: `for i := range 3` → `0 1 2` ✔run (его go.mod: `go 1.22`).

#### K10. map
- **Суть:** «Словарь: по ключу находишь значение. Нет ключа → получаешь "нулевое значение" (0, ""), а не ошибку. Есть ли ключ — узнаёшь через `v, ok := m[k]`. Порядок обхода не гарантирован.»
- **Память:** `ages: { "Ali" → 21, "Dana" → 22 }`; `ages["Nobody"]` → 0 (ключа нет, ошибки нет).
- **Пример ✔run:**
```go
ages := map[string]int{"Ali": 20}
ages["Dana"] = 22
ages["Ali"]++
fmt.Println(ages["Ali"], ages["Nobody"], len(ages))
v, ok := ages["Nobody"]
fmt.Println(v, ok)
```
→ `21 0 2`, `0 false`.
- **Предскажи:** почему `ages["Nobody"]` не ошибка? → нулевое значение int.
- **Ошибки:** `var m map[string]int; m["x"] = 1` → `panic: assignment to entry in nil map` (создавать через `map[string]int{}` или `make`); полагаться на порядок `range`; путать «0 потому что нет» и «0 потому что записан 0» (нужен `ok`).

#### K11. struct
- **Суть:** «Структура — анкета с полями: одно значение хранит несколько связанных (имя, возраст). Присваивание и передача в функцию копируют всю анкету.»
- **Память:** `a: {Name:"Nurs", Age:30}` → `b := a` → `b: {…30}` КОПИЯ → `b.Age = 99` не трогает a.
- **Пример ✔run:**
```go
type Student struct {
	Name string
	Age  int
}

func birthdayCopy(s Student) { s.Age++ }
func birthday(s *Student)    { s.Age++ }

func main() {
	a := Student{Name: "Nurs", Age: 30}
	b := a
	b.Age = 99
	birthdayCopy(a)
	fmt.Println(a.Age, b.Age)
	birthday(&a)
	fmt.Println(a.Age)
	fmt.Printf("%+v\n", a)
}
```
→ `30 99`, `31`, `{Name:Nurs Age:31}`.
- **Предскажи:** почему после `birthdayCopy(a)` возраст 30? → функция изменила копию.
- **Ошибки:** ждать, что функция изменит переданную по значению структуру; `birthday(a)` вместо `birthday(&a)` → `cannot use a (variable of struct type Student) as *Student value…`.

#### K12. Указатели
- **Суть:** «Указатель — адрес ячейки, а не значение. `&x` — "адрес x". `*p` — "то, что лежит по адресу p" (можно читать и менять). `*int` в типе — "адрес, где лежит int". Нужен, когда функция должна изменить чужую переменную.»
- **Память:**
```
адрес   | имя | значение
0xc000  | x   | 5 → 10
0xc008  | p   | 0xc000        (p := &x)
*p = 10  → пишем по адресу 0xc000, то есть в x
```
- **Пример ✔run:**
```go
x := 5
p := &x
*p = 10
fmt.Println(x, *p, p == &x)
```
→ `10 10 true`. `var q *int; fmt.Println(*q)` → `panic: runtime error: invalid memory address or nil pointer dereference`.
- **Предскажи:** первую строку и почему x изменился, хотя x не трогали напрямую.
- **Ошибки:** путать `*` в типе (`*Student`) и `*` в выражении (`*p`); забыть `&` при вызове; разыменовать nil.
- **Аналогия:** адрес квартиры на бумажке. Ломается: копий бумажки много — квартира одна; пустая бумажка (nil) → идти некуда → паника.

### Gaps
- Effective Go states it was written for Go's 2009 release and is not actively updated (no generics, modules or later library changes) — used here only for stable basics — [Effective Go](https://go.dev/doc/effective_go).
- The Go 1.12 (sorted map printing) and Go 1.22 (`range` over int) release notes were not re-fetched; both behaviours were confirmed by running go1.26.5.
- Whether 01-edu exam checkers compare returned values (vs stdout) for every function task was not verified; the print-vs-return risk rests on the learner's own exam history.

---

## 4. Popular beginner resources: what they do well or badly for a true absolute beginner

### Takeaway
None of the popular Go resources is designed for someone who has never programmed: the official getting-started tutorial and Learn Go with Tests explicitly assume programming experience, Exercism says it is not for total beginners, and Learning Go targets developers with another language. They are useful in specific roles: Go by Example as a reference of tiny runnable programs, Learn Go with Tests later to drill return-based functions, Exercism for graded practice once basics are solid. Head First Go and Todd McLeod's course are the most beginner-aimed but are long-form (book / many hours of video), which clashes with this learner's short-text, practice-first profile.

### Cited Findings
- A Tour of Go: welcome text says it is divided into modules with "a series of slides and exercises"; it states no prerequisites — [tour source](https://raw.githubusercontent.com/golang/website/master/_content/tour/welcome.article)
- Official "Get started" tutorial prerequisite: "Some programming experience. The code here is pretty simple, but it helps to know something about functions." — [go.dev](https://go.dev/doc/tutorial/getting-started)
- Go by Example: "a hands-on introduction to Go using annotated example programs"; topic order starts Hello World, Values, Variables, Constants, For, If/Else, Switch, Arrays, Slices, Maps, Functions, Multiple Return Values — [gobyexample.com](https://gobyexample.com/)
- Learn Go with Tests: for "People who are interested in picking up Go" and those who want TDD; needs "Some experience with programming. Understanding of concepts like `if`, variables, functions etc." and comfort with the terminal — [GitHub](https://github.com/quii/learn-go-with-tests)
- Exercism: replies to reviews say the platform isn't designed for total beginners and point beginners to jiki.io; Exercism's Go docs say it can be difficult to jump into for those learning Go for the first time (per search summaries) — [Exercism Go docs](https://exercism.org/docs/tracks/go), [Exercism forum](https://forum.exercism.org/t/is-exercism-meant-only-for-people-who-already-have-some-experience-in-programming/12311), [Trustpilot replies](https://fr.trustpilot.com/review/exercism.org); in 2018 a learner reported 31 Go mentors for 11,843 students (dated, anecdotal) — [Reddit mirror](https://redlib.hbubli.cc/r/learngolang/comments/95wtmy/comments_on_exercism)
- Head First Go (McGavren, 2019): reviewers call it suitable for fairly new programmers / beginners; one notes it predates modules and uses GOPATH; experienced readers find it slow — [DEV review](https://dev.to/jasric89/head-first-go-book-review-22e9), [Goodreads](https://www.goodreads.com/book/show/36800891)
- Learning Go (Bodner): reviewed as the best single-volume Go book for experienced developers; "you will get the most out of this book if you already have some prior experience with another programming language" (reader review); focus on idiomatic Go — [Bitfield Consulting](https://bitfieldconsulting.com/posts/jon-bodner-learning-go), [Goodreads](https://www.goodreads.com/book/show/55841848)
- Todd McLeod, "Learn How To Code: Google's Go (golang) Programming Language" (Udemy): aimed at beginners and experienced developers; listed lengths vary from 12 to 45 hours of video across snapshots; ~4.6 rating, mixed reviews — [Careers360](https://www.careers360.com/courses-certifications/udemy-learn-how-code-googles-go-golang-programming-language-course), [CTgoodjobs](https://www2.ctgoodjobs.hk/Learning/1387475259/udemy/learn-how-to-code-googles-go-golang-programming-language)

### Inferences

| Ресурс | Хорошо для него | Плохо для него | Как использовать тьютору |
|---|---|---|---|
| A Tour of Go | Запуск в браузере, официальный, короткие слайды | Темп для тех, кто уже кодил; нет «машины в памяти» | Только как справочник синтаксиса после урока |
| Go by Example | Крошечные программы + вывод — идеально под Predict | Нет упражнений и «почему»; функции после map | Брать примеры как материал для «предскажи вывод» |
| Learn Go with Tests | Тесты проверяют ВОЗВРАЩЁННОЕ значение — лечит print-vs-return | Требует if/переменные/функции; два новых слоя (Go + TDD) | Позже: тренировать экзаменные функции |
| Exercism Go | Задачи с автопроверкой | Сам говорит: не для полных новичков; менторов мало | После 2–3 недель основ, без ИИ |
| Head First Go | Самый «новичковый» стиль | Длинная книга, GOPATH | Отдельные главы как картинки-объяснения |
| Learning Go (Bodner) | Идиоматичный Go | Для программистов | Не сейчас |
| Todd McLeod | Для новичков, подробно | Часы видео — против «практика, коротко» | Только точечные ролики по застрявшей теме |

### Gaps
- Head First Go's and Learning Go's own audience statements (publisher pages returned 403) were not verified; "Get Programming with Go" (Manning, marketed at beginners) could not be checked.
- No comparative study of these resources' learning outcomes for absolute beginners was found; assessments are from their own prerequisites and reviews.

---

## 5. Worked lesson: making `data, err := os.ReadFile(input)` and `if err != nil { fmt.Println("error:", err); return }` truly understood

### Takeaway
Teach the block as the end of a prerequisite chain (call → return value → two return values → `:=` → `[]byte` → `nil` → `if !=` → `return` in `main`), then run a PRIMM sequence on the learner's own copy program: predict outputs for "file exists / missing / empty / directory / no permission", fill a memory table, break the block on purpose (remove `return` → the output file is silently wiped; `err == nil`; `_`; unused `err`; second `err :=`), then rebuild without AI. Mastery = 10 check questions answered without hints, a paper rewrite, and a 2-minute teach-back; re-check after 1, 3 and 7 days.

### Cited Findings
- All programs and outputs in this section were run with go1.26.5 (✔run); behaviours rest on the official docs cited in §3: `ReadFile` signature and contract — [pkg os](https://pkg.go.dev/os#ReadFile); `WriteFile` truncation and permissions — [pkg os](https://pkg.go.dev/os#WriteFile); program exits when `main` returns — [Go spec](https://go.dev/ref/spec#Program_execution); `nil` error = no error — [Go spec](https://go.dev/ref/spec#Errors); redeclaration rule for `:=` — [Go spec](https://go.dev/ref/spec#Short_variable_declarations); unused-variable rationale — [Go FAQ](https://go.dev/doc/faq#unused_variables_and_imports); errors as values — [Go blog](https://go.dev/blog/errors-are-values)
- Design basis: PRIMM sequence — [QMUL record](https://qmro.qmul.ac.uk/xmlui/handle/123456789/57800?show=full); tracing/read-before-write — [Xie et al.](https://faculty.washington.edu/ajko/papers/Xie2019IntroCSTheoryOfInstruction.pdf); explain-in-own-words as a gate — [Lehtinen et al.](https://arxiv.org/abs/2104.06710), [Murphy et al.](https://opus.lib.uts.edu.au/citation/handle/10453/22969); Parsons problems for the delayed check — [Ericson et al.](https://hg.gatech.edu/node/603172); spaced retrieval for follow-ups — [Matuschak notes](https://notes.andymatuschak.org/zGfjkW1ociSmSUCLcpbhKjf)

### Inferences — the lesson (≈75 min, 5 blocks of ~15 min; can split after Step 3)

**Цель (критерии мастерства) — без ИИ он:**
1. читает строку вслух своими словами (функция, пакет, аргумент, два результата, `:=`);
2. заполняет таблицу памяти для 3 случаев (файл есть / нет / пустой);
3. точно предсказывает вывод при отсутствии файла;
4. объясняет и показывает, что ломается без `return`;
5. пишет блок из 5 строк на бумаге по памяти;
6. переносит идею: пишет проверку для `os.WriteFile`;
7. объясняет соседу за 2 минуты.

**Пререквизиты по порядку** (каждый: мини-программа ✔run + 1 вопрос; ответил верно — пропускаем):

| # | Понятие | Программа (внутри main) | Вывод | Вопрос-проверка |
|---|---|---|---|---|
| P1 | Порядок выполнения | `fmt.Println("A")` / `fmt.Println("B")` | `A` / `B` | «Что первым и почему?» |
| P2 | `:=` и `=` | `x := 5` / `x = 7` / `fmt.Println(x)` | `7` | «А если вместо `x = 7` написать `x := 7`?» → `no new variables on left side of :=` |
| P3 | Функция возвращает значение | `n := len("hi")` / `fmt.Println(n + 1)` | `3` | «Откуда в n взялось 2?» → len вернула |
| P4 | Два результата | `q, r := divmod(17, 5)` / `fmt.Println(q, r)` | `3 2` | «А `q := divmod(17, 5)`?» → assignment mismatch |
| P5 | Байты и текст | `fmt.Println([]byte("hi"))` / `fmt.Println(string([]byte{104, 105}))` | `[104 105]` / `hi` | «Почему числа?» |
| P6 | nil = «пусто» | `var err error` / `fmt.Println(err)` / `fmt.Println(err == nil)` | `<nil>` / `true` | «Что значит nil у ошибки?» → ошибки нет |
| P7 | `if` + `!=` | `x := 3` / `if x != 0 { fmt.Println("не ноль") }` | `не ноль` | «А при `x := 0`?» → ничего |
| P8 | `return` в main | `fmt.Println("A")` / `return` / `fmt.Println("B")` | `A` | «Почему нет B?» (`go vet`: `unreachable code`) |

**Шаг 1 — PREDICT.** Файл `input.txt` содержит `hi` + Enter. Программа:
```go
data, err := os.ReadFile("input.txt")
fmt.Println(len(data), err)
```
Тьютор: «Предскажи вывод. Подсказка: два значения через пробел.» Ждать письменного ответа. Затем: «Удаляем input.txt. Что теперь?»

**Шаг 2 — RUN** ✔run: `3 <nil>`; без файла: `0 open input.txt: no such file or directory`. Сравнить: «что совпало, что нет?» (частая ошибка — ответ 2: забыт байт перевода строки).

**Шаг 3 — INVESTIGATE.**
- Прочитать сигнатуру: `go doc os.ReadFile` → `func ReadFile(name string) ([]byte, error)`: «слева от скобок — что даём (имя файла, строка), справа — что получаем (байты И ошибку)».
- Чтение вслух (шаблон): «Вызываем функцию ReadFile из пакета os и даём ей имя файла из переменной input. Она возвращает два значения. `:=` создаёт две новые переменные: в data — содержимое файла в байтах, в err — ошибка или nil.»
- Таблица памяти — он заполняет, тьютор проверяет ✔run:

| Случай | `data` | `err` | `fmt.Println(len(data), err)` |
|---|---|---|---|
| файл `hi\n` | `[104 105 10]` | `nil` | `3 <nil>` |
| файла нет | `nil` (len 0) | `open input.txt: no such file or directory` | `0 open input.txt: …` |
| пустой файл | пустой (len 0, не nil) | `nil` | `0 <nil>` — **пустой файл не ошибка** |
| input.txt — папка | — | `read input.txt: is a directory` | — |
| `chmod 000 input.txt` | — | `open input.txt: permission denied` | — |

- Вопросы: «Сколько значений вернула ReadFile? Почему `:=`, а не `=`? Что значит nil в этой таблице? Откуда в сообщении слово open?»

**Шаг 4 — MODIFY** (каждый: предскажи → запусти → объясни):
- **M1. Добавить защиту** (как в его программе):
```go
data, err := os.ReadFile("input.txt")
if err != nil {
	fmt.Println("error:", err)
	return
}
fmt.Println(string(data))
```
Без файла ✔run → `error: open input.txt: no such file or directory`; с файлом → `hi`.
- **M2. Убрать `return` — главная демонстрация.** В copy.txt лежит `IMPORTANT DATA` (15 байт). Программа без `return` ✔run:
```go
data, err := os.ReadFile("nofile.txt")
if err != nil {
	fmt.Println("error:", err)
}
err = os.WriteFile("copy.txt", data, 0644)
fmt.Println("copied", len(data), "bytes, err =", err)
```
→ `error: open nofile.txt: no such file or directory`, `copied 0 bytes, err = <nil>`, и copy.txt теперь **0 байт**. Вывод для него: «напечатать ошибку мало — без return программа идёт дальше с пустыми data и затирает файл».
- **M3. Перевернуть условие** на `err == nil` ✔run: с файлом → `error: <nil>` и конец; без файла → пустая строка. «Объясни оба результата.»
- **M4. Заглушить ошибку** `data, _ := os.ReadFile("nofile.txt")` ✔run → печатается пусто, программа «довольна» — молчаливая поломка.
- **M5. Удалить if-блок, оставив `data, err :=`** → `declared and not used: err` ✔run: «Go не даёт забыть про ошибку — пришлось бы явно написать `_`».
- **M6. В его main.go, строка 25:** заменить `err =` на `err :=` → `no new variables on left side of :=` ✔run: «err уже создан в строке 17».
- **M7 (по желанию).** `echo $?` после запуска без файла → `0` ✔run; заменить `return` на `os.Exit(1)` → `exit status 1` ✔run. «return в main = программа вежливо закончилась; os.Exit(1) = сообщила системе о провале.»

**Шаг 5 — MAKE** (без ИИ, сначала на бумаге):
- **T1 «cat»:** прочитать файл из `os.Args[1]` и напечатать текст; без аргумента → `usage: go run . <file>` и return; ошибка → `error: …` и return.
- **T2:** добавить вывод числа байтов и символов: `len(data)` и `len([]rune(string(data)))`; проверить на файле `привет\n` → `13 7` ✔run.
- **T3 (на следующий день):** написать заново весь копировщик (его 30-строчный main.go) по памяти, затем сравнить с оригиналом построчно.

**Гейт мастерства — вопросы** (все без подсказок; любой провал → назад к шагу, который это учит; повтор завтра):

| # | Вопрос | Ожидаемый ответ (смысл) | Типичный неверный ответ → что делать |
|---|---|---|---|
| 1 | «Прочитай строку 17 вслух своими словами» | функция ReadFile из os, даём имя, возвращает байты и ошибку, `:=` создаёт data и err | «data равно ReadFile» → таблица чтения вслух (§2.4) |
| 2 | «Какой тип у data и у err?» | `[]byte` и `error` | «string» → P5 + сигнатура |
| 3 | «Что в data и err, если файла нет?» | data пустой (nil), err = `open …: no such file or directory` | «программа упадёт» → Шаг 2 |
| 4 | «Пустой файл — ошибка?» | нет: len 0, err nil | «да» → строка таблицы Шага 3 |
| 5 | «Переведи `err != nil` на русский» | «если что-то пошло не так» | «если ошибка не ноль» → P6 |
| 6 | «Зачем return? Что будет без него в копировщике?» | программа продолжит и затрёт/создаст пустой выходной файл | «просто напечатает ошибку» → M2 вживую |
| 7 | «Почему в строке 25 `=`, а не `:=`?» | err уже создан; `:=` нужна хотя бы одна новая переменная | «без разницы» → M6 |
| 8 | «Что выведет программа без аргументов?» | `usage: go run . <in> <out>` (проверка длины os.Args) | «паника» → K5 |
| 9 | «Что будет при `data, _ :=`, если файла нет?» | молча продолжит с пустыми данными | — → M4 |
| 10 | «Напиши на бумаге проверку для `err = os.WriteFile(...)`» | `if err != nil { fmt.Println("error:", err); return }` | путает `=`/`:=` → M6 |

**Teach-back (аудит, 2 минуты), образец его речи:** «Строка 17: вызываю os.ReadFile с именем файла из input. Функция возвращает два значения: содержимое файла в байтах и ошибку. `:=` создаёт переменные data и err. Строка 18: если err не nil — файл не прочитался: печатаю ошибку и делаю return — выхожу из main, программа заканчивается, чтобы не работать дальше с пустыми данными. Если err nil — блок пропускается и я работаю с data. Try/catch в Go нет: ошибка — обычное значение, её проверяют if'ом.» Вопрос соседа-аудитора для тренировки: «А если файл пустой?» → «Это не ошибка: err nil, данных ноль байт.»

**Повторы (spacing):**
- +1 день: вопросы 1, 6, 7 по памяти (устно, 3 мин).
- +3 дня: блок на бумаге; Parsons — 10 строк его копировщика вперемешку → собрать по порядку.
- +7 дней: «найди баг» под таймером без ИИ: три версии (нет `return` / `err == nil` / второй `err :=`).

**Аналогия на урок (одна, с поломкой):** «ReadFile — окно ЦОНа: подаёшь заявление (имя файла), получаешь ДВЕ вещи: документ (data) и справку (err). Справка пустая (nil) — документ можно использовать. В справке отказ — документ не трогаем и уходим (return).» Где ломается: в Go обе «вещи» есть всегда (две переменные), даже когда одна пустая; и «уйти» завершает всю программу только потому, что мы внутри `main` — из другой функции return вернёт к тому, кто её вызвал.

### Gaps
- The lesson design is an inference from the cited general evidence; it has not been tested with this learner or with peers at Tomorrow School.
- Whether the school's subjects/auditors expect `return` (exit code 0) or a non-zero exit code after an error was not verified; check each subject.
- Timing (≈75 min) is an estimate, not measured.
