import { CLINIC, SERVICE_META, priceLabel, type Content, type Lang } from "./content";
import { nextAvailability } from "./slots";

export type Action = { label: string; href: string };
export type Answer = { id: string; text: string; actions?: Action[] };

type Reply = (t: Content, lang: Lang) => Answer;

type Intent = {
  id: string;
  /** Emergencies must win even when the sentence also mentions a price. */
  priority?: number;
  bg: string[];
  en: string[];
  reply: Reply;
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[.,!?;:()„“"'’]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const money = (t: Content, lang: Lang, i: number) => {
  const p = priceLabel(SERVICE_META[i].price, lang);
  return `${t.services.from} ${p.eur} (${p.bgn})`;
};

const line = (t: Content, lang: Lang, i: number) =>
  `${t.services.items[i].title} — ${money(t, lang, i)}, ~${SERVICE_META[i].duration} ${t.services.min}`;

const book = (t: Content): Action => ({ label: t.nav.book, href: "#chas" });
const call = (t: Content): Action => ({ label: t.contact.reception, href: `tel:${CLINIC.phoneHref}` });
const sos = (t: Content): Action => ({ label: t.topbar.emergency, href: `tel:${CLINIC.emergencyHref}` });

function soonest(t: Content) {
  const next = nextAvailability(3);
  if (!next) return null;
  const when =
    next.offset === 0
      ? t.hero.today
      : next.offset === 1
        ? t.hero.tomorrow
        : `${t.booking.weekdays[next.date.getDay()]}, ${next.date.getDate()} ${
            t.booking.months[next.date.getMonth()]
          }`;
  return { when, times: next.times };
}

const INTENTS: Intent[] = [
  {
    id: "emergency",
    priority: 6,
    bg: ["спешн", "спешен", "спешно", "кърви", "кръв", "отров", "натрав", "не диша", "задавил", "припадна", "гърч", "блъсна", "прегази", "падна от", "счупи", "усукан корем", "подут корем", "не може да уринира", "не може да пишка", "не уринира"],
    en: ["emergency", "urgent", "bleeding", "blood", "poison", "swallowed", "not breathing", "choking", "seizure", "collapsed", "hit by a car", "fell from", "broken", "bloated", "can't pee", "cannot urinate"],
    reply: (t) => ({
      id: "emergency",
      text:
        t.lang === "bg"
          ? `Обадете се веднага на ${CLINIC.emergency}. Телефонът се вдига от дежурен ветеринарен лекар денонощно, включително в празници.\n\nДокато пътувате: не давайте храна и вода и не предизвиквайте повръщане без указание от лекаря. Ако има погълнато вещество, вземете опаковката със себе си.\n\nАдресът е ${t.address}. Ако случаят е спешен, отваряме клиниката и Ви чакаме на входа.`
          : `Call ${CLINIC.emergency} now. A veterinarian on call answers around the clock, holidays included.\n\nWhile you travel: no food or water, and do not induce vomiting unless the vet tells you to. If something was swallowed, bring the packaging with you.\n\nThe address is ${t.address}. If it is urgent we open the clinic and meet you at the door.`,
      actions: [sos(t)],
    }),
  },
  {
    id: "symptom",
    priority: 3,
    bg: ["повръща", "диария", "разстройство", "кашля", "куца", "сърби", "чеше", "не яде", "отказва храна", "апатич", "температура", "хърка", "подут", "оток", "рана", "ухо", "око", "кихa", "киха"],
    en: ["vomit", "diarrhea", "diarrhoea", "coughing", "limping", "itchy", "scratching", "not eating", "off food", "lethargic", "fever", "swelling", "wound", "ear infection", "eye", "sneezing"],
    reply: (t) => ({
      id: "symptom",
      text:
        t.lang === "bg"
          ? `По описание не мога да поставя диагноза — това изисква преглед. Правилният ред е клиничен преглед (${money(
              t,
              "bg",
              0
            )}), а при нужда кръвни изследвания (${money(t, "bg", 4)}) или образна диагностика (${money(
              t,
              "bg",
              3
            )}). Резултатите излизат на място, същия ден.\n\nАко състоянието се влошава бързо, има кръв, силна болка или животното не диша спокойно — не чакайте час, звъннете на ${CLINIC.emergency}.`
          : `I can't diagnose from a description — that needs an examination. The usual order is a clinical exam (${money(
              t,
              "en",
              0
            )}), then blood work (${money(t, "en", 4)}) or imaging (${money(
              t,
              "en",
              3
            )}) if needed. Results come back on site, the same day.\n\nIf things are getting worse fast, there is blood, severe pain or laboured breathing — don't book, call ${CLINIC.emergency}.`,
      actions: [book(t), sos(t)],
    }),
  },
  {
    id: "price-exam",
    priority: 2,
    bg: ["цена на преглед", "колко струва преглед", "преглед цена", "профилактичен преглед", "първичен преглед", "консултация"],
    en: ["price of an exam", "how much is an exam", "exam price", "check-up", "checkup", "consultation", "wellness exam"],
    reply: (t, l) => ({
      id: "price-exam",
      text:
        t.lang === "bg"
          ? `${line(t, l, 0)}.\n\nВключва пълен клиничен преглед, преценка на теглото, зъбите, ушите и кожата. Ако се наложи изследване, чувате цената преди да го направим — без добавки на касата.`
          : `${line(t, l, 0)}.\n\nThat covers a full clinical check-up — weight, teeth, ears and skin. If a test is needed you hear the price before we run it, with nothing added at the counter.`,
      actions: [book(t)],
    }),
  },
  {
    id: "price-vaccine",
    priority: 2,
    bg: ["ваксин", "паспорт", "бяс", "микрочип", "чип", "имунизац"],
    en: ["vaccin", "passport", "rabies", "microchip", "chip", "immunis", "immuniz"],
    reply: (t, l) => ({
      id: "price-vaccine",
      text:
        t.lang === "bg"
          ? `${line(t, l, 1)}.\n\nКомплексната ваксина, ваксината срещу бяс, микрочипът и международният паспорт се правят на място, в едно посещение. Преди ваксинация животното се преглежда — ваксинираме само клинично здрави пациенти.\n\nЗа пътуване в ЕС ваксината срещу бяс е валидна 21 дни след поставянето ѝ, затова планирайте поне три седмици напред.`
          : `${line(t, l, 1)}.\n\nThe core vaccine, rabies shot, microchip and EU pet passport are all done on site in one visit. We examine the animal first — only clinically healthy patients are vaccinated.\n\nFor EU travel the rabies vaccine becomes valid 21 days after it is given, so plan at least three weeks ahead.`,
      actions: [book(t)],
    }),
  },
  {
    id: "price-surgery",
    priority: 2,
    bg: ["кастрац", "стерилиз", "операц", "хирург", "упойк", "анестез"],
    en: ["neuter", "spay", "castrat", "surgery", "operation", "anaesth", "anesth"],
    reply: (t, l) => ({
      id: "price-surgery",
      text:
        t.lang === "bg"
          ? `${line(t, l, 5)}. Кастрацията на котарак започва от 55 €; при женска котка и при кучета цената е по-висока и зависи от вида и теглото.\n\nРаботим с инхалационна анестезия и мониторинг на дишането и сърдечната дейност. Преди планова операция правим предоперативни кръвни изследвания (${money(
              t,
              "bg",
              4
            )}). Точната сума я получавате писмено преди самата операция.`
          : `${line(t, l, 5)}. Neutering a male cat starts at €55; for a female cat or for dogs the price is higher and depends on species and weight.\n\nWe use inhalation anaesthesia with breathing and cardiac monitoring. Before planned surgery we run pre-operative blood work (${money(
              t,
              "en",
              4
            )}). You get the exact figure in writing before the operation itself.`,
      actions: [book(t), call(t)],
    }),
  },
  {
    id: "price-dental",
    priority: 2,
    bg: ["зъб", "зъбен камък", "уста", "дъх"],
    en: ["dental", "teeth", "tartar", "breath", "mouth"],
    reply: (t, l) => ({
      id: "price-dental",
      text:
        t.lang === "bg"
          ? `${line(t, l, 2)}.\n\nПочистването е ултразвуково и се прави под кратка обща анестезия — само така се стига под венеца, където е проблемът. Ако се наложи вадене на зъб, казваме цената по време на процедурата, преди да продължим.`
          : `${line(t, l, 2)}.\n\nScaling is ultrasonic and done under short general anaesthesia — that is the only way to reach below the gum line, which is where the problem sits. If a tooth has to come out, we tell you the price during the procedure before going further.`,
      actions: [book(t)],
    }),
  },
  {
    id: "price-imaging",
    priority: 2,
    bg: ["ехограф", "рентген", "скенер", "образна", "ултразвук"],
    en: ["ultrasound", "x-ray", "xray", "radiograph", "imaging", "scan"],
    reply: (t, l) => ({
      id: "price-imaging",
      text:
        t.lang === "bg"
          ? `${line(t, l, 3)}.\n\nРентгенът е дигитален, а ехографията се прави на място от лекаря, който води случая. Резултатът е готов до 20 минути и го обсъждаме с Вас веднага, без да Ви връщаме втори път.`
          : `${line(t, l, 3)}.\n\nThe X-ray is digital and the ultrasound is done on site by the vet handling your case. Results are ready within 20 minutes and we go through them with you straight away, with no second trip.`,
      actions: [book(t)],
    }),
  },
  {
    id: "price-lab",
    priority: 2,
    bg: ["кръвн", "лаборатор", "изследван", "биохими", "урина", "проба"],
    en: ["blood", "lab", "test", "biochem", "urine", "sample"],
    reply: (t, l) => ({
      id: "price-lab",
      text:
        t.lang === "bg"
          ? `${line(t, l, 4)}.\n\nКръвната картина и биохимията се правят в клиниката, без чакане за външна лаборатория. Резултатът е готов по време на прегледа и остава в дигиталния картон на животното.`
          : `${line(t, l, 4)}.\n\nBlood count and biochemistry are run in-house, with no waiting on an outside lab. Results are ready during the visit and stay in your pet's digital record.`,
      actions: [book(t)],
    }),
  },
  {
    id: "price-all",
    bg: ["цен", "колко струва", "колко ще струва", "тарифа", "ценоразпис", "скъпо", "бюджет", "струва ли"],
    en: ["price", "prices", "cost", "how much", "fee", "rate", "expensive"],
    reply: (t, l) => ({
      id: "price-all",
      text:
        (t.lang === "bg"
          ? "Основните цени, всички публикувани:\n"
          : "The main prices, all published:\n") +
        SERVICE_META.map((_, i) => `• ${line(t, l, i)}`).join("\n") +
        (t.lang === "bg"
          ? `\n\nЦените са в евро, с левова равностойност за ориентир. Ако по време на прегледа се наложи нещо извън тях, чувате сумата преди да го направим.`
          : `\n\nPrices are in euro, with the lev equivalent for reference. If anything beyond this comes up during the visit, you hear the figure before we proceed.`),
      actions: [book(t)],
    }),
  },
  {
    id: "hours",
    priority: 2,
    bg: ["работно време", "работите ли", "отворен", "отворено", "затворен", "затваряте", "неделя", "събота", "почивен", "празник", "до колко", "от колко часа", "днес отворено"],
    en: ["opening hours", "open", "closed", "sunday", "saturday", "holiday", "what time", "when do you"],
    reply: (t) => ({
      id: "hours",
      text:
        (t.lang === "bg" ? "Работно време:\n" : "Opening hours:\n") +
        t.contact.hours.map((h) => `• ${h.day} — ${h.from} – ${h.to}`).join("\n") +
        (t.lang === "bg"
          ? `\n\nРаботим и в събота, и в неделя. Спешните случаи се приемат денонощно, включително на официални празници, на ${CLINIC.emergency}.`
          : `\n\nWe are open on Saturday and Sunday too. Emergencies are taken around the clock, public holidays included, on ${CLINIC.emergency}.`),
      actions: [book(t)],
    }),
  },
  {
    id: "walkin",
    priority: 3,
    bg: ["без час", "без записване", "директно", "да дойда сега", "мога ли да дойда", "чака ли се", "опашк"],
    en: ["walk in", "walk-in", "without an appointment", "just come", "queue", "waiting time"],
    reply: (t) => ({
      id: "walkin",
      text:
        t.lang === "bg"
          ? `Може да дойдете и без час — приемаме и без предварително записване. С час обаче чакате значително по-малко, защото времето е запазено за Вас.\n\nПазим и по два слота на ден за спешни случаи, така че при нужда почти винаги Ви поемаме в същия ден.`
          : `You can come without an appointment — walk-ins are accepted. With a booking you wait considerably less, because the slot is held for you.\n\nWe also keep two slots a day for urgent cases, so if something comes up we can almost always see you the same day.`,
      actions: [book(t)],
    }),
  },
  {
    id: "booking",
    priority: 2,
    bg: ["час", "запази", "запаз", "записв", "запиши", "свободн", "кога мога", "резерв", "график"],
    en: ["book", "booking", "appointment", "slot", "available", "reserve", "schedule"],
    reply: (t) => {
      const s = soonest(t);
      return {
        id: "booking",
        text: s
          ? t.lang === "bg"
            ? `Най-ранните свободни часове са ${s.when}: ${s.times.join(
                ", "
              )}.\n\nЗаписването отнема под минута — избирате животно, услуга, ден и час, и получавате потвърждение веднага, заедно с файл за календара. Два часа преди прегледа изпращаме SMS напомняне.`
            : `The earliest free times are ${s.when}: ${s.times.join(
                ", "
              )}.\n\nBooking takes under a minute — pick the animal, the service, a day and a time, and you get instant confirmation plus a calendar file. Two hours before the visit we send an SMS reminder.`
          : t.lang === "bg"
            ? `В момента онлайн не се показват свободни часове. Обадете се на ${CLINIC.phone} — в регистратурата виждат и слотовете, които пазим за спешни случаи.`
            : `No online slots are showing right now. Call ${CLINIC.phone} — reception can also see the slots we hold for urgent cases.`,
        actions: [book(t), call(t)],
      };
    },
  },
  {
    id: "address",
    priority: 2,
    bg: ["адрес", "къде се намира", "къде сте", "как да стигна", "паркинг", "паркиране", "карта", "квартал", "транспорт"],
    en: ["address", "where are you", "how to get", "parking", "map", "location", "directions"],
    reply: (t) => ({
      id: "address",
      text:
        t.lang === "bg"
          ? `Адресът е ${t.address}. Картата с точното място е най-долу на страницата.\n\nВходът е на улично ниво, без стъпала, така че може да влезете и с транспортна клетка, и с голямо куче. Телефонът на регистратурата е ${CLINIC.phone}.`
          : `We are at ${t.address}. The map with the exact spot is at the bottom of the page.\n\nThe entrance is at street level with no steps, so you can come in with a carrier or a large dog. Reception is on ${CLINIC.phone}.`,
      actions: [{ label: t.nav.contact, href: "#kontakti" }],
    }),
  },
  {
    id: "species",
    priority: 2,
    bg: ["котк", "коте", "гризач", "заек", "морско свинче", "хамстер", "папагал", "птиц", "влечуг", "костенурк", "змия", "екзотич", "порче"],
    en: ["cat", "kitten", "rodent", "rabbit", "guinea pig", "hamster", "parrot", "bird", "reptile", "tortoise", "turtle", "snake", "exotic", "ferret"],
    reply: (t) => ({
      id: "species",
      text:
        t.lang === "bg"
          ? `Работим с кучета, котки, гризачи, зайци, птици и влечуги.\n\nЗа котките има отделна чакалня, за да не стоят срещу кучета — това сваля стреса и прави прегледа по-точен. Екзотичните видове приемаме след предварителна уговорка, за да е дежурен лекарят, който ги води.`
          : `We see dogs, cats, rodents, rabbits, birds and reptiles.\n\nCats have a separate waiting area so they are not sat opposite dogs — that lowers stress and makes the examination more reliable. Exotics are seen by prior arrangement, so the vet who handles them is on shift.`,
      actions: [book(t)],
    }),
  },
  {
    id: "payment",
    priority: 2,
    bg: ["плащ", "плати", "с карта", "в брой", "фактура", "бон", "евро", "лева", "разсрочено"],
    en: ["pay", "payment", "card", "cash", "invoice", "receipt", "euro", "lev", "instal"],
    reply: (t) => ({
      id: "payment",
      text:
        t.lang === "bg"
          ? `Плащането е в брой или с карта, след прегледа. Издаваме фискален бон, а при поискване и фактура на фирма.\n\nЦените са в евро, с левова равностойност по фиксирания курс 1 € = 1,95583 лв. При планова операция получавате сумата писмено предварително.`
          : `You pay in cash or by card after the visit. We issue a receipt, and a company invoice on request.\n\nPrices are in euro, with the lev equivalent at the fixed rate €1 = BGN 1.95583. For planned surgery you get the figure in writing beforehand.`,
      actions: [book(t), call(t)],
    }),
  },
  {
    id: "records",
    priority: 2,
    bg: ["картон", "документ", "история", "епикриза", "резултат", "копие"],
    en: ["records", "history", "report", "results", "copy", "file"],
    reply: (t) => ({
      id: "records",
      text:
        t.lang === "bg"
          ? `Всеки преглед, изследване и ваксина се записват в дигитален картон на животното. При поискване Ви изпращаме копие по имейл — включително резултати от кръвни изследвания и снимки от образната диагностика.\n\nАко смените клиника, картонът е Ваш и го получавате без условия.`
          : `Every exam, test and vaccine goes into your pet's digital record. On request we email you a copy — including blood results and imaging.\n\nIf you change clinics, the record is yours and you get it with no conditions.`,
      actions: [{ label: t.contact.reception, href: `tel:${CLINIC.phoneHref}` }],
    }),
  },
  {
    id: "travel",
    priority: 3,
    bg: ["пътуван", "чужбина", "самолет", "границ", "ес", "европейски паспорт", "извеждане"],
    en: ["travel", "abroad", "flight", "border", "eu pet", "taking my dog"],
    reply: (t) => ({
      id: "travel",
      text:
        t.lang === "bg"
          ? `За пътуване в ЕС са нужни микрочип, валидна ваксина срещу бяс и международен паспорт — издаваме и трите на място (${money(
              t,
              "bg",
              1
            )}).\n\nВажно: ваксината срещу бяс става валидна 21 дни след поставянето ѝ при първа имунизация. За държави извън ЕС изискванията са различни и понякога включват титър за бяс — кажете ни държавата и ще проверим конкретните условия.`
          : `For EU travel you need a microchip, a valid rabies vaccine and an EU pet passport — we issue all three on site (${money(
              t,
              "en",
              1
            )}).\n\nImportant: for a first rabies vaccination the vaccine becomes valid 21 days after it is given. Outside the EU the rules differ and can include a rabies titre test — tell us the country and we'll check the exact requirements.`,
      actions: [book(t)],
    }),
  },
  {
    id: "puppy",
    priority: 3,
    bg: ["кученце", "малко куче", "новородено", "котенце", "първа ваксина", "обезпаразит", "бълхи", "кърлеж", "глист"],
    en: ["puppy", "kitten", "first vaccine", "deworm", "fleas", "ticks", "worms"],
    reply: (t, l) => ({
      id: "puppy",
      text:
        t.lang === "bg"
          ? `За малко кученце или котенце редът е: преглед и обезпаразитяване, след това първа комплексна ваксина, реваксинация след 21 дни, а ваксината срещу бяс — обикновено след навършване на 12 седмици.\n\nПървото посещение е преглед (${money(
              t,
              "bg",
              0
            )}), ваксинацията с паспорт е ${money(
              t,
              "bg",
              1
            )}. Обезпаразитяващите средства ги вземате на място, с дозата за точното тегло.`
          : `For a puppy or kitten the order is: examination and deworming, then the first core vaccine, a booster 21 days later, and the rabies vaccine usually after 12 weeks of age.\n\nThe first visit is an examination (${money(
              t,
              "en",
              0
            )}) and vaccination with a passport is ${money(
              t,
              "en",
              1
            )}. Parasite treatments are available on site, dosed to the exact weight.`,
      actions: [book(t)],
    }),
  },
  {
    id: "shop",
    priority: 2,
    bg: ["магазин", "храна", "диет", "нашийник", "играчк", "клетка", "легло"],
    en: ["shop", "store", "food", "diet", "collar", "toy", "carrier", "bed"],
    reply: (t) => ({
      id: "shop",
      text:
        t.lang === "bg"
          ? `Зоомагазинът е в съседната врата на клиниката. Има лечебни храни за бъбреци, стомах, стави и тегло, обезпаразитяване с точната доза, както и нашийници, транспортни клетки, играчки и легла.\n\nЛекарят изписва храната или лекарството и го вземате веднага, без втора обиколка из града.`
          : `The pet shop is right next door to the clinic. It stocks prescription diets for kidneys, stomach, joints and weight, parasite control dosed for your animal, plus collars, carriers, toys and beds.\n\nThe vet prescribes the food or medication and you pick it up on the spot, with no second trip across town.`,
      actions: [{ label: t.nav.shop, href: "#magazin" }],
    }),
  },
  {
    id: "team",
    priority: 2,
    bg: ["лекар", "доктор", "екип", "кой ще", "специалист", "хирург ли", "опит"],
    en: ["vet", "doctor", "team", "who will", "specialist", "experience"],
    reply: (t) => ({
      id: "team",
      text:
        (t.lang === "bg" ? "Екипът на клиниката:\n" : "The clinic team:\n") +
        t.team.members.map((m) => `• ${m.name} — ${m.role}. ${m.line}`).join("\n") +
        (t.lang === "bg"
          ? `\n\nПри записване може да изберете предпочитан лекар. Един и същ лекар води случая от първия преглед до контролния.`
          : `\n\nYou can choose a preferred vet when booking. The same vet follows the case from the first visit to the check-up.`),
      actions: [{ label: t.nav.team, href: "#ekip" }, book(t)],
    }),
  },
  {
    id: "home-visit",
    priority: 3,
    bg: ["домашно посещение", "на адрес", "вкъщи", "да дойдете"],
    en: ["home visit", "house call", "come to my home"],
    reply: (t) => ({
      id: "home-visit",
      text:
        t.lang === "bg"
          ? `Домашни посещения правим само в ограничени случаи — най-често при трудно подвижни животни или евтаназия. Диагностиката (лаборатория, рентген, ехограф) е в клиниката, затова прегледът на място винаги дава повече.\n\nЗа да преценим случая, обадете се на ${CLINIC.phone}.`
          : `We do home visits only in limited cases — usually for animals that can't travel, or for euthanasia. Diagnostics (lab, X-ray, ultrasound) are at the clinic, so an in-clinic visit always gives more.\n\nCall ${CLINIC.phone} and we'll assess the case.`,
      actions: [call(t)],
    }),
  },
  {
    id: "greeting",
    bg: ["здравей", "здрасти", "добър ден", "добро утро", "добър вечер", "ехо", "хей"],
    en: ["hello", "hi", "hey", "good morning", "good evening", "good afternoon"],
    reply: (t) => ({
      id: "greeting",
      text:
        t.lang === "bg"
          ? `Здравейте. Мога да Ви помогна с цени, свободни часове, работно време, подготовка за пътуване и спешни случаи. Кажете с какво да започнем.`
          : `Hello. I can help with prices, available times, opening hours, travel paperwork and emergencies. Tell me where to start.`,
    }),
  },
  {
    id: "thanks",
    bg: ["благодар", "мерси", "супер", "чудесно"],
    en: ["thank", "thanks", "great", "perfect", "cheers"],
    reply: (t) => ({
      id: "thanks",
      text:
        t.lang === "bg"
          ? `Моля. Ако искате да запазите час, отнема под минута и получавате потвърждение веднага.`
          : `You're welcome. If you'd like to book, it takes under a minute and you get instant confirmation.`,
      actions: [book(t)],
    }),
  },
  {
    id: "affirmative",
    bg: ["да", "искам", "нека", "давай", "ок"],
    en: ["yes", "sure", "ok", "okay", "please do"],
    reply: (t) => {
      const s = soonest(t);
      return {
        id: "affirmative",
        text:
          t.lang === "bg"
            ? `Добре.${s ? ` Най-ранните свободни часове са ${s.when}: ${s.times.join(", ")}.` : ""} Формата за записване е по-надолу в страницата и отнема под минута.`
            : `Of course.${s ? ` The earliest free times are ${s.when}: ${s.times.join(", ")}.` : ""} The booking form is further down the page and takes under a minute.`,
        actions: [book(t)],
      };
    },
  },
];

/** Longer, more specific keywords outrank generic ones, and priority breaks ties. */
function score(q: string, keys: string[]) {
  let best = 0;
  for (const k of keys) {
    if (!q.includes(k)) continue;
    const boundary = new RegExp(`(^|\\s)${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(q);
    best = Math.max(best, k.length + (boundary ? 4 : 0));
  }
  return best;
}

export function answer(question: string, t: Content, lang: Lang): Answer {
  const q = norm(question);
  if (!q) {
    return { id: "fallback", text: t.assistant.fallback.replace("{phone}", CLINIC.phone) };
  }

  let bestIntent: Intent | null = null;
  let bestScore = 0;

  for (const pass of [lang, lang === "bg" ? "en" : "bg"] as Lang[]) {
    for (const intent of INTENTS) {
      const s = score(q, pass === "bg" ? intent.bg : intent.en);
      if (!s) continue;
      const weighted = s * (intent.priority ?? 1);
      if (weighted > bestScore) {
        bestScore = weighted;
        bestIntent = intent;
      }
    }
    if (bestIntent) break;
  }

  if (bestIntent) return bestIntent.reply(t, lang);

  return {
    id: "fallback",
    text: t.assistant.fallback.replace("{phone}", CLINIC.phone),
    actions: [book(t), call(t)],
  };
}

export const INTENT_IDS = INTENTS.map((i) => i.id);
