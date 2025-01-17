import { max, min, sum, clone } from './functions/util.js';

class Property {
    constructor() { }

    TYPES = {
        // 本局
        AGE: "AGE", // 年龄 age AGE
        /*         CHR: "CHR", // 颜值 charm CHR
                INT: "INT", // 智力 intelligence INT
                STR: "STR", // 体质 strength STR
                MNY: "MNY", // 家境 money MNY
                SPR: "SPR", // 快乐 spirit SPR
                LIF: "LIF", // 生命 life LIFE
                TLT: "TLT", // 天赋 talent TLT
                EVT: "EVT", // 事件 event EVT
                TMS: "TMS", // 次数 times TMS */

        MAG: "MAG",  // 魔法 magic MAG
        SCI: "SCI", // 科学 science SCI
        STR: "STR", // 体能 strength STR
        //HMY: "HMY", // 谐律 harmony HMY
        HNY: "HNY", // 诚实 honesty HNY
        LYT: "LYT", // 忠诚 loyalty LYT
        GNR: "GNR", // 慷慨 generosity GNR
        KID: "KID", // 善良 kindness KID
        LAG: "LAG", // 欢笑 laughter LAG

        MNY: "MNY", // 家境 money MNY
        SPR: "SPR", // 快乐 spirit SPR
        LIF: "LIF", // 生命 life LIFE
        TLT: "TLT", // 天赋 talent TLT
        EVT: "EVT", // 事件 event EVT
        TMS: "TMS", // 次数 times TMS

        // Auto calc
        LAGE: "LAGE", // 最低年龄 Low Age
        HAGE: "HAGE", // 最高年龄 High Age

        LMAG: "LMAG", // 最低魔法
        HMAG: "HMAG", // 最高魔法
        LSCI: "LSCI", // 最低科学
        HSCI: "HSCI", // 最高科学 
        LSTR: "LSTR", // 最低体能
        HSTR: "HSTR", // 最高体能
        LHNY: "LHNY", // 最低诚实
        HHNY: "HHNY", // 最高诚实
        LLYT: "LLYT", // 最低忠诚
        HLYT: "HLYT", // 最高忠诚
        LGNR: "LGNR", // 最低慷慨
        HGNR: "HGNR", // 最高慷慨
        LKID: "LKID", // 最低善良
        HKID: "HKID", // 最高善良
        LLAG: "LLAG", // 最低欢笑
        HLAG: "HLAG", // 最高欢笑


        LMNY: "LMNY", // 最低家境 Low Money
        HMNY: "HMNY", // 最高家境 High Money
        LSPR: "LSPR", // 最低快乐 Low Spirit
        HSPR: "HSPR", // 最高快乐 High Spirit

        SUM: "SUM", // 总评 summary SUM

        EXT: "EXT", // 继承天赋

        // 总计
        // Achievement Total
        ATLT: "ATLT", // 拥有过的天赋 Achieve Talent
        AEVT: "AEVT", // 触发过的事件 Achieve Event
        ACHV: "ACHV", // 达成的成就 Achievement

        CTLT: "RTLT", // 天赋选择数 Count Talent
        CEVT: "REVT", // 事件收集数 Count Event
        CACHV: "CACHV", // 成就达成数 Count Achievement

    };

    #ageData;
    #data = {};

    initial({ age }) {

        this.#ageData = age;
        for (const a in age) {
            let { event, talent } = age[a];
            if (!Array.isArray(event))
                event = event?.split(',') || [];

            event = event.map(v => {
                const value = `${ v }`.split('*').map(n => Number(n));
                if (value.length == 1) value.push(1);
                return value;
            });

            if (!Array.isArray(talent))
                talent = talent?.split(',') || [];

            talent = talent.map(v => Number(v));

            age[a] = { event, talent };
        }
    }

    restart(data) {
        this.#data = {
            [this.TYPES.AGE]: -1,

            [this.TYPES.MNY]: 0,
            [this.TYPES.SPR]: 0,

            [this.TYPES.MAG]: 0,
            [this.TYPES.SCI]: 0,
            [this.TYPES.STR]: 0,
            [this.TYPES.HNY]: 0,
            [this.TYPES.LYT]: 0,
            [this.TYPES.GNR]: 0,
            [this.TYPES.KID]: 0,
            [this.TYPES.LAG]: 0,

            [this.TYPES.LIF]: 1,

            [this.TYPES.TLT]: [],
            [this.TYPES.EVT]: [],

            [this.TYPES.LAGE]: Infinity,
            [this.TYPES.LMAG]: Infinity,
            [this.TYPES.LSCI]: Infinity,
            [this.TYPES.LSTR]: Infinity,
            [this.TYPES.LHNY]: Infinity,
            [this.TYPES.LLYT]: Infinity,
            [this.TYPES.LGNR]: Infinity,
            [this.TYPES.LKID]: Infinity,
            [this.TYPES.LLAG]: Infinity,

            [this.TYPES.HAGE]: -Infinity,
            [this.TYPES.HMAG]: -Infinity,
            [this.TYPES.HSCI]: -Infinity,
            [this.TYPES.HSTR]: -Infinity,
            [this.TYPES.HHNY]: -Infinity,
            [this.TYPES.HLYT]: -Infinity,
            [this.TYPES.HGNR]: -Infinity,
            [this.TYPES.HKID]: -Infinity,
            [this.TYPES.HLAG]: -Infinity,

            [this.TYPES.HSPR]: -Infinity,
        };
        for (const key in data)
            this.change(key, data[key]);
    }

    restartLastStep() {
        this.#data[this.TYPES.LAGE] = this.get(this.TYPES.AGE);
        this.#data[this.TYPES.LMAG] = this.get(this.TYPES.MAG);
        this.#data[this.TYPES.LSCI] = this.get(this.TYPES.SCI);
        this.#data[this.TYPES.LSTR] = this.get(this.TYPES.STR);
        this.#data[this.TYPES.LHNY] = this.get(this.TYPES.HNY);
        this.#data[this.TYPES.LLYT] = this.get(this.TYPES.LYT);
        this.#data[this.TYPES.LGNR] = this.get(this.TYPES.GNR);
        this.#data[this.TYPES.LKID] = this.get(this.TYPES.KID);
        this.#data[this.TYPES.LLAG] = this.get(this.TYPES.LAG);

        this.#data[this.TYPES.LSPR] = this.get(this.TYPES.SPR);
        this.#data[this.TYPES.LMNY] = this.get(this.TYPES.MNY);

        this.#data[this.TYPES.HAGE] = this.get(this.TYPES.AGE);
        this.#data[this.TYPES.HMAG] = this.get(this.TYPES.MAG);
        this.#data[this.TYPES.HSCI] = this.get(this.TYPES.SCI);
        this.#data[this.TYPES.HSTR] = this.get(this.TYPES.STR);
        this.#data[this.TYPES.HHNY] = this.get(this.TYPES.HNY);
        this.#data[this.TYPES.HLYT] = this.get(this.TYPES.LYT);
        this.#data[this.TYPES.HGNR] = this.get(this.TYPES.GNR);
        this.#data[this.TYPES.HKID] = this.get(this.TYPES.KID);
        this.#data[this.TYPES.HLAG] = this.get(this.TYPES.LAG);

        this.#data[this.TYPES.HMNY] = this.get(this.TYPES.MNY);
        this.#data[this.TYPES.HSPR] = this.get(this.TYPES.SPR);
    }

    get(prop) {
        switch (prop) {
            case this.TYPES.AGE:

            case this.TYPES.MAG:
            case this.TYPES.SCI:
            case this.TYPES.STR:
            case this.TYPES.HNY:
            case this.TYPES.LYT:
            case this.TYPES.GNR:
            case this.TYPES.KID:
            case this.TYPES.LAG:

            case this.TYPES.MNY:
            case this.TYPES.SPR:
            case this.TYPES.LIF:
            case this.TYPES.TLT:
            case this.TYPES.EVT:
                return clone(this.#data[prop]);
            case this.TYPES.LAGE:
            case this.TYPES.LMAG:
            case this.TYPES.LSCI:
            case this.TYPES.LSTR:
            case this.TYPES.LHNY:
            case this.TYPES.LLYT:
            case this.TYPES.LGNR:
            case this.TYPES.LKID:
            case this.TYPES.LLAG:
            case this.TYPES.LMNY:
            case this.TYPES.LSPR:
                return min(
                    this.#data[prop],
                    this.get(this.fallback(prop))
                );
            case this.TYPES.HAGE:
            case this.TYPES.HMAG:
            case this.TYPES.HSCI:
            case this.TYPES.HSTR:
            case this.TYPES.HHNY:
            case this.TYPES.HLYT:
            case this.TYPES.HGNR:
            case this.TYPES.HKID:
            case this.TYPES.HLAG:
            case this.TYPES.HMNY:
            case this.TYPES.HSPR:
                return max(
                    this.#data[prop],
                    this.get(this.fallback(prop))
                );
            case this.TYPES.SUM:
                const HAGE = this.get(this.TYPES.HAGE);
                const HMAG = this.get(this.TYPES.HMAG);
                const HSCI = this.get(this.TYPES.HSCI);
                const HSTR = this.get(this.TYPES.HSTR);
                const HMNY = this.get(this.TYPES.HMNY);
                const HSPR = this.get(this.TYPES.HSPR);
                return Math.floor(sum(HMAG, HSCI, HSTR, HMNY, HSPR) * 2 + HAGE / 2);
            case this.TYPES.TMS:
                return this.lsget('times') || 0;
            case this.TYPES.EXT:
                return this.lsget('extendTalent') || null;
            case this.TYPES.ATLT:
            case this.TYPES.AEVT:
            case this.TYPES.ACHV:
                return this.lsget(prop) || [];
            case this.TYPES.CTLT:
            case this.TYPES.CEVT:
            case this.TYPES.CACHV:
                return this.get(
                    this.fallback(prop)
                ).length;
            default: return 0;
        }
    }

    fallback(prop) {
        switch (prop) {
            case this.TYPES.LAGE:
            case this.TYPES.HAGE: return this.TYPES.AGE;
            case this.TYPES.LMAG:
            case this.TYPES.HMAG: return this.TYPES.MAG;
            case this.TYPES.LSCI:
            case this.TYPES.HSCI: return this.TYPES.SCI;
            case this.TYPES.LSTR:
            case this.TYPES.HSTR: return this.TYPES.STR;
            case this.TYPES.LHNY:
            case this.TYPES.HHNY: return this.TYPES.HNY
            case this.TYPES.LLYT:
            case this.TYPES.HLYT: return this.TYPES.LYT
            case this.TYPES.LGNR:
            case this.TYPES.HGNR: return this.TYPES.GNR
            case this.TYPES.LKID:
            case this.TYPES.HKID: return this.TYPES.KID
            case this.TYPES.LLAG:
            case this.TYPES.HLAG: return this.TYPES.LAG
            case this.TYPES.LMNY:
            case this.TYPES.HMNY: return this.TYPES.MNY;
            case this.TYPES.LSPR:
            case this.TYPES.HSPR: return this.TYPES.SPR;
            case this.TYPES.CTLT: return this.TYPES.ATLT;
            case this.TYPES.CEVT: return this.TYPES.AEVT;
            case this.TYPES.CACHV: return this.TYPES.ACHV;
            default: return;
        }
    }

    set(prop, value) {
        switch (prop) {
            case this.TYPES.AGE:
            case this.TYPES.MAG:
            case this.TYPES.SCI:
            case this.TYPES.STR:
            case this.TYPES.HNY:
            case this.TYPES.LYT:
            case this.TYPES.GNR:
            case this.TYPES.KID:
            case this.TYPES.LAG:
            case this.TYPES.MNY:
            case this.TYPES.SPR:
            case this.TYPES.LIF:
            case this.TYPES.TLT:
            case this.TYPES.EVT:
                this.hl(prop, this.#data[prop] = clone(value));
                this.achieve(prop, value);
                return;
            case this.TYPES.TMS:
                this.lsset('times', parseInt(value) || 0);
                return;
            case this.TYPES.EXT:
                this.lsset('extendTalent', value);
                return
            default: return;
        }
    }

    getLastRecord() {
        return clone({
            [this.TYPES.AGE]: this.get(this.TYPES.AGE),
            [this.TYPES.MNY]: this.get(this.TYPES.MNY),
            [this.TYPES.SPR]: this.get(this.TYPES.SPR),

            [this.TYPES.MAG]: this.get(this.TYPES.MAG),
            [this.TYPES.SCI]: this.get(this.TYPES.SCI),
            [this.TYPES.STR]: this.get(this.TYPES.STR),
            [this.TYPES.HNY]: this.get(this.TYPES.HNY),
            [this.TYPES.LYT]: this.get(this.TYPES.LYT),
            [this.TYPES.GNR]: this.get(this.TYPES.GNR),
            [this.TYPES.KID]: this.get(this.TYPES.KID),
            [this.TYPES.LAG]: this.get(this.TYPES.LAG),
        });
    }

    change(prop, value) {
        if (Array.isArray(value)) {
            for (const v of value)
                this.change(prop, Number(v));
            return;
        }
        switch (prop) {
            case this.TYPES.AGE:
            case this.TYPES.MAG:
            case this.TYPES.SCI:
            case this.TYPES.STR:
            case this.TYPES.HNY:
            case this.TYPES.LYT:
            case this.TYPES.GNR:
            case this.TYPES.KID:
            case this.TYPES.LAG:
            case this.TYPES.MNY:
            case this.TYPES.SPR:
            case this.TYPES.LIF:
                this.hl(prop, this.#data[prop] += Number(value));
                return;
            case this.TYPES.TLT:
            case this.TYPES.EVT:
                const v = this.#data[prop];
                if (value < 0) {
                    const index = v.indexOf(value);
                    if (index != -1) v.splice(index, 1);
                }
                if (!v.includes(value)) v.push(value);
                this.achieve(prop, value);
                return;
            case this.TYPES.TMS:
                this.set(
                    prop,
                    this.get(prop) + parseInt(value)
                );
                return;
            default: return;
        }
    }

    effect(effects) {
        for (const prop in effects)
            this.change(prop, Number(effects[prop]));
    }

    isEnd() {
        return this.get(this.TYPES.LIF) < 1;
    }

    ageNext() {
        this.change(this.TYPES.AGE, 1);
        const age = this.get(this.TYPES.AGE);
        const { event, talent } = this.getAgeData(age);
        return { age, event, talent };
    }

    getAgeData(age) {
        return clone(this.#ageData[age]);
    }

    hl(prop, value) {
        let keys;
        switch (prop) {
            case this.TYPES.AGE: keys = [this.TYPES.LAGE, this.TYPES.HAGE]; break;
            case this.TYPES.MAG: keys = [this.TYPES.LMAG, this.TYPES.HMAG]; break;
            case this.TYPES.SCI: keys = [this.TYPES.LSCI, this.TYPES.HSCI]; break;
            case this.TYPES.STR: keys = [this.TYPES.LSTR, this.TYPES.HSTR]; break;
            case this.TYPES.HNY: keys = [this.TYPES.LHNY, this.TYPES.HHNY]; break;
            case this.TYPES.LYT: keys = [this.TYPES.LLTY, this.TYPES.HLYT]; break;
            case this.TYPES.GNR: keys = [this.TYPES.LGNR, this.TYPES.HGNR]; break;
            case this.TYPES.KID: keys = [this.TYPES.LKID, this.TYPES.HKID]; break;
            case this.TYPES.LAG: keys = [this.TYPES.LLAG, this.TYPES.HLAG]; break;
            case this.TYPES.MNY: keys = [this.TYPES.LMNY, this.TYPES.HMNY]; break;
            case this.TYPES.SPR: keys = [this.TYPES.LSPR, this.TYPES.HSPR]; break;
            default: return;
        }
        const [l, h] = keys;
        this.#data[l] = min(this.#data[l], value);
        this.#data[h] = max(this.#data[h], value);
    }

    achieve(prop, newData) {
        let key;
        switch (prop) {
            case this.TYPES.ACHV:
                const lastData = this.lsget(prop);
                this.lsset(
                    prop,
                    (lastData || []).concat([[newData, Date.now()]])
                );
                return;
            case this.TYPES.TLT: key = this.TYPES.ATLT; break;
            case this.TYPES.EVT: key = this.TYPES.AEVT; break;
            default: return;
        }
        const lastData = this.lsget(key) || [];
        this.lsset(
            key,
            Array.from(
                new Set(
                    lastData
                        .concat(newData || [])
                        .flat()
                )
            )
        )
    }

    lsget(key) {
        const data = localStorage.getItem(key);
        if (data === null) return;
        return JSON.parse(data);
    }

    lsset(key, value) {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );
    }
}

export default Property;