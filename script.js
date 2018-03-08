Tone.context.latencyHint = 'fastest';

//функции для создания html 

const arrMaker = (name, number) => {
    let arr = [];
    for (let i = 1; i <= number; i += 1) {
        arr.push(name + i);
    };
    return arr;
};

const seqConst = (idDiv, idInput, row) => {
    let rowId = document.getElementById(row);
    let div = document.createElement('div');
    let input = document.createElement('input');
    div.id = idDiv;
    input.id = idInput;
    input.type = 'checkbox';
    rowId.appendChild(div);
    let docDiv = document.getElementById(idDiv);
    docDiv.appendChild(input);
};

const createElem = (number, sign, isign, row) => {
    for (let i = 1; i <= number; i += 1) {
        seqConst(sign + i, isign + i, row);
    };
};

//ряды звуков    

createElem(16, 'aCb', 'aheck', 'row1');
createElem(16, 'bCb', 'bheck', 'row2');
createElem(16, 'cCb', 'check', 'row3');
createElem(16, 'dCb', 'dheck', 'row4');

// ряды акцентов

createElem(16, 'aCheck', 'a1check', 'acc1');
createElem(16, 'bCheck', 'b1check', 'acc2');
createElem(16, 'cCheck', 'c1check', 'acc3');
createElem(16, 'dCheck', 'd1check', 'acc4');

//объявления синтезаторов и эффектов    

let limiter = new Tone.Limiter(-6).toMaster();
let comp = new Tone.Compressor(-30, 3).connect(limiter);
let dist = new Tone.Distortion(0).connect(comp);
let reverb = new Tone.Freeverb(0.2, 15000).connect(comp);
let chorus = new Tone.Chorus(100, 0.5, 1).connect(reverb);
reverb.wet.value = 0.5;
let pingPong = new Tone.PingPongDelay(0.0001, 0.9).connect(comp);
pingPong.wet.value = 0.5;
let cheby = new Tone.Chebyshev(50).connect(comp);

let aSynth = new Tone.MetalSynth({
    frequency: 100,
    envelope: {
        attack: 0.001,
        decay: 0.4,
        release: 0.2
    },
    harmonicity: 0,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 0.5
}).connect(pingPong);

let bSynth = new Tone.MembraneSynth({
    pitchDecay: 0.005,
    octaves: 2,
    oscillator: {},
    envelope: {
        attack: 0.001,
        decay: 1,
        sustain: 0,
        release: 0.4
    }
}).connect(cheby);

let bSynthFreq = 400;

let cSynth = new Tone.NoiseSynth().connect(chorus);

let cPodSynth = new Tone.MembraneSynth({
    pitchDecay: 0.1,
    octaves: 2,
    envelope: {
        sustain: 0,
        release: 0.1,
    }
}).connect(chorus);

let dSynth = new Tone.MembraneSynth().connect(dist);

//массивы звуков

let aArr = arrMaker('aheck', 16);
let aDiletr = arrMaker('aCb', 16);

let bArr = arrMaker('bheck', 16);
let bDiletr = arrMaker('bCb', 16);

let cArr = arrMaker('check', 16);
let cDiletr = arrMaker('cCb', 16);

let dArr = arrMaker('dheck', 16);
let dDiletr = arrMaker('dCb', 16);

//массивы акцентов

let aСheck = arrMaker('a1check', 16);
let bСheck = arrMaker('b1check', 16);
let cСheck = arrMaker('c1check', 16);
let dСheck = arrMaker('d1check', 16);
let i = 0;

// переменные громкостей    

let aVolume = -6;
let bVolume = 0;
let cVolume = -2;
let cPodVolume = 0;
let dVolume = 0;

//управление характеристиками звуков 

const interface = document.getElementById('interface');
interface.addEventListener('input', function (e) {
    let target = e.target;
    switch (target.id) {
        case 'hatHarmony':
            aSynth.harmonicity = e.target.value;
            break;

        case 'hatResonance':
            aSynth.resonance = e.target.value;
            break;

        case 'hatDelay':
            pingPong.delayTime.value = e.target.value;
            break;

        case 'tomDecay':
            bSynth.envelope.decay = e.target.value;
            break;

        case 'tomAttack':
            bSynth.envelope.attack = e.target.value;
            break;

        case 'tomTune':
            bSynthFreq = e.target.value;
            break;

        case 'noiseDecay':
            cSynth.envelope.decay = e.target.value;
            cPodSynth.envelope.decay = e.target.value;
            break;

        case 'noiseAttack':
            cSynth.envelope.attack = e.target.value;
            cPodSynth.envelope.attack = e.target.value;
            break;

        case 'noiseReverb':
            reverb.roomSize.value = e.target.value;
            break;

        case 'kickPitch':
            dSynth.octaves = parseInt(e.target.value);
            break;

        case 'kickDecay':
            dSynth.envelope.decay = e.target.value;
            break;

        case 'kickDist':
            dist.distortion = e.target.value;
            break;
    };
});

//управление темпом секвенции
//логика кнопок старт, стоп и очистки чекбоксов
//управление внешним видом кнопок при нажатии

const buttons = document.getElementById('playStop');

buttons.addEventListener('mousedown', function (e) {
    let target = e.target;
    if (target.id === 'start' || target.id === 'stop' || target.id === 'clear') {
        target.style.backgroundColor = "#e7bb41";
    };
});

buttons.addEventListener('mouseup', function (e) {
    let target = e.target;
    if (target.id === 'start' || target.id === 'stop' || target.id === 'clear') {
        target.style.backgroundColor = "";
    };
});

buttons.addEventListener('click', function (e) {
    let target = e.target;
    switch (target.id) {
        case 'start':
            seq.start();
            break;
        case 'stop':
            seq.stop();
            i = 0;
            break;
        case 'clear':
            let clist = document.getElementsByTagName("input");
            for (let i = 0; i < clist.length; ++i) {
                clist[i].checked = false;
            };
    };
});

buttons.addEventListener('input', function (e) {
    let bpm = document.getElementById('bpmIntView');
    Tone.Transport.bpm.value = parseInt(e.target.value);
    bpm.value = parseInt(Tone.Transport.bpm.value);
});


let seq = new Tone.Sequence(function (time, note) {

    //массивы акцентов

    let aCh = document.getElementById(aСheck[i]);
    let bCh = document.getElementById(bСheck[i]);
    let cCh = document.getElementById(cСheck[i]);
    let dCh = document.getElementById(dСheck[i]);

    //массивы звуков    

    const aDv = document.getElementById(aDiletr[i]);
    let abox = document.getElementById(aArr[i]);

    const bDv = document.getElementById(bDiletr[i]);
    let bbox = document.getElementById(bArr[i]);

    const cDv = document.getElementById(cDiletr[i]);
    let cbox = document.getElementById(cArr[i]);

    const dDv = document.getElementById(dDiletr[i]);
    let dbox = document.getElementById(dArr[i]);

    //проверка массива акцентов на checked

    if (aCh.checked) {
        aSynth.envelope.decay = 1.5;
        aSynth.frequency.value = 20;
    } else {
        aSynth.envelope.decay = 0.4;
        aSynth.frequency.value = 10;
    };

    let bVel;
    let dVel;
    let cVel;

    if (bCh.checked) {
        bVel = 1;
    } else {
        bVel = 0.5;
    };

    if (dCh.checked) {
        dVel = 1;
    } else {
        dVel = 0.5;
    };

    if (cCh.checked) {
        cVel = 1;
    } else {
        cVel = 0.1;
    };

    //функция возвращения изначального цвета

    const colorChekd = () => {
        aDv.style.backgroundColor = '';
        bDv.style.backgroundColor = '';
        cDv.style.backgroundColor = '';
        dDv.style.backgroundColor = '';
    };

    //проверка массива звуков на checked

    if (abox.checked) {
        aSynth.triggerAttackRelease();
        aDv.style.backgroundColor = '#44bba4';
        setTimeout(colorChekd, 1000);
    } else {
        aDv.style.backgroundColor = 'gray';
        setTimeout(colorChekd, 1000);
    };

    if (bbox.checked) {
        bSynth.triggerAttack(bSynthFreq, undefined, bVel);
        bDv.style.backgroundColor = '#44bba4';
        setTimeout(colorChekd, 100);
    } else {
        bDv.style.backgroundColor = 'gray';
        setTimeout(colorChekd, 100);
    };

    if (cbox.checked) {
        cSynth.triggerAttack(undefined, cVel);
        cPodSynth.triggerAttack("C3", undefined, cVel);
        cDv.style.backgroundColor = '#44bba4';
        setTimeout(colorChekd, 100);
    } else {
        cDv.style.backgroundColor = 'gray';
        setTimeout(colorChekd, 100);
    };

    if (dbox.checked) {
        dSynth.triggerAttack("C1", undefined, dVel);
        dDv.style.backgroundColor = '#44bba4';
        setTimeout(colorChekd, 100);
    } else {
        dDv.style.backgroundColor = 'gray';
        setTimeout(colorChekd, 100);
    };

    //добавление шага в секвенцию
    i += 1;

    //блок управления громкостью элементов

    aSynth.volume.value = aVolume;
    bSynth.volume.value = bVolume;
    cSynth.volume.value = cVolume;
    cPodSynth.volume.value = cPodVolume;
    dSynth.volume.value = dVolume;

    interface.addEventListener('input', function (e) {
        let target = e.target;
        switch (target.id) {

            case 'hatVolume':
                aVolume = e.target.value;
                break;

            case 'tomVolume':
                bVolume = e.target.value;
                break;

            case 'noiseVolume':
                cVolume = e.target.value;
                cPodVolume = e.target.value;
                break;

            case 'kickVolume':
                dVolume = e.target.value;
                break;
        };
    });

    //проверка на конец секвенции
    if (i === cArr.length) {
        i = 0;
    };
}, cArr, "16n");

Tone.Transport.start();