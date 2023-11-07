/* eslint-disable */

export const defaultOnboardingTripettoStyle = {
  ru: {
    centerActiveBlock: true,
    showProgressbar: true,
    showEnumerators: true,
    showNavigation: true,
    showScrollbar: true,
    footer: { navigationStyle: 'light', progressbarStyle: 'primary' },
    autoFocus: false,
    buttons: {
      okStyle: 'primary',
      completeLabel: 'Продолжить',
      completeStyle: 'success',
      okLabel: 'Дальше',
      backLabel: 'Назад',
    },
  },
  en: {
    centerActiveBlock: true,
    showProgressbar: true,
    showEnumerators: true,
    showNavigation: true,
    showScrollbar: true,
    footer: { navigationStyle: 'light', progressbarStyle: 'primary' },
    autoFocus: false,
    buttons: {
      okStyle: 'primary',
      completeLabel: 'Finish',
      completeStyle: 'success',
      okLabel: 'Next',
      backLabel: 'Back',
    },
  },
}

export const defaultOnboardingTripettoDefinition = {
  en: {
    name: 'Onboarding EN / v.3',
    clusters: [
      {
        id: '7e9d7434dc69cf5d94a54b353361f30a5d81b2296718345f847c23d848f23466',
        nodes: [
          {
            id: 'ab9e91fa395a1dbfa2283081999c9b701ed9c331add81a47b9467357f47001ed',
            name: 'Hi! I am Sober Bot! 🤖',
            nameVisible: true,
            description:
              "I will guide you through quick onboarding and ask a few questions to personalize Sober One for you. Let's start!",
          },
          {
            id: '7e0d7ef323b078447cd1120775f75bed5b23abe0d43a95cdfda551916870cf98',
            name: 'May I have your name, please?',
            nameVisible: true,
            description: 'We care about privacy, so you can use a nickname.😉',
            slots: [
              {
                id: 'd608f967f146840dd25baceb3f9023296bd7a3ab42794c544f653275a821fdc4',
                type: 'text',
                kind: 'static',
                reference: 'value',
                label: 'Text',
                alias: 'name',
                required: true,
                transformation: 'capitalize',
              },
            ],
            block: { type: 'tripetto-block-text', version: '5.0.4' },
          },
          {
            id: 'cb079ecf16e2872b4e69b1f5f5f17cce035a791632f1604f15289a155d84ba7b',
            name: 'All right, @d608f967f146840dd25baceb3f9023296bd7a3ab42794c544f653275a821fdc4, happy to see you here!',
            nameVisible: true,
            description:
              'Allow me to tell you a bit about this app. \n\nSober One is a modern and casual tool to achieve whatever you want: drink more responsibly, cut your weekly drinking, or quit.',
          },
          {
            id: 'de56f2c454895e8af576527238c829c73c0a2a09ec3ec18d6ae106ae96719530',
            name: "First, let's dig deeper into your drinking habits 👀",
            nameVisible: true,
            description: '',
          },
          {
            id: '2cd3624bf7c58e7c217a1bce83f2f59203f08a6cf98caf114216e837b5f729eb',
            name: 'How many times a week do you have a drink? 🗓',
            nameVisible: true,
            description: '',
            slots: [
              {
                id: '2a1420f635ce1e63481458517e02c0375e73fc9a9709c8dc1468bb1ac3c78be0',
                type: 'string',
                kind: 'static',
                reference: 'choice',
                label: 'Choice',
                alias: 'why',
                required: true,
              },
            ],
            block: {
              type: 'tripetto-block-multiple-choice',
              version: '5.2.3',
              choices: [
                {
                  id: '6dd27b6e65de737e69eb57a22876807119499daaebe6755e14b8d15b6c98821d',
                  name: '1-2',
                },
                {
                  id: '207e7ad031a93e62e3e79696d01b746f22aa9e448a38399be9dbd591b521b8c9',
                  name: '3-4',
                },
                {
                  id: 'c72092a03a37735133ff3da3036ae39d2403a90ce24482c7d9d08906cea1cfce',
                  name: '5-6',
                },
                {
                  id: '5fe7e3728d0d0211a6da824ca94542956decef0a42acd0b28ea718642134d717',
                  name: 'I drink on daily basis',
                },
              ],
              multiple: false,
              alignment: true,
              required: true,
              alias: 'why',
            },
          },
          {
            id: 'ab6124ccce32dfa71dfabc2b409711fc47c32b0f76c086995945898136a52699',
            name: 'What kind of drinks do you prefer? 🍸',
            nameVisible: true,
            description: '',
            slots: [
              {
                id: '02e1af3fe68c41aafc58070c07598b1e71006ff90b460e28c0d88749ff13a649',
                type: 'string',
                kind: 'static',
                reference: 'choice',
                label: 'Choice',
                alias: 'why',
                required: true,
              },
            ],
            block: {
              type: 'tripetto-block-multiple-choice',
              version: '5.2.3',
              choices: [
                {
                  id: '6dd27b6e65de737e69eb57a22876807119499daaebe6755e14b8d15b6c98821d',
                  name: 'Beer',
                },
                {
                  id: '207e7ad031a93e62e3e79696d01b746f22aa9e448a38399be9dbd591b521b8c9',
                  name: 'Wine',
                },
                {
                  id: 'ad89c0a3b579b528fb78cde4937a1b1a8e27a97f44a710c82331a0150f6fde8e',
                  name: 'Cocktails',
                },
                {
                  id: 'c72092a03a37735133ff3da3036ae39d2403a90ce24482c7d9d08906cea1cfce',
                  name: 'Spirits',
                },
                {
                  id: '5fe7e3728d0d0211a6da824ca94542956decef0a42acd0b28ea718642134d717',
                  name: 'Other',
                },
              ],
              multiple: false,
              alignment: true,
              required: true,
              alias: 'why',
            },
          },
          {
            id: '7f79527408279784e68393deacca571e2dbec191917b68fd04710e055b6e02ad',
            name: 'With whom do you usually drink? 👥',
            nameVisible: true,
            description: '',
            slots: [
              {
                id: '8b299713b08decb33b72fdf4aba7d2749f5cdce6b34d91f60c015e2393b6c1f4',
                type: 'string',
                kind: 'static',
                reference: 'choice',
                label: 'Choice',
                alias: 'why',
                required: true,
              },
            ],
            block: {
              type: 'tripetto-block-multiple-choice',
              version: '5.2.3',
              choices: [
                {
                  id: '6dd27b6e65de737e69eb57a22876807119499daaebe6755e14b8d15b6c98821d',
                  name: 'Big company',
                },
                {
                  id: '207e7ad031a93e62e3e79696d01b746f22aa9e448a38399be9dbd591b521b8c9',
                  name: 'Close friends',
                },
                {
                  id: 'c72092a03a37735133ff3da3036ae39d2403a90ce24482c7d9d08906cea1cfce',
                  name: 'Partner',
                },
                {
                  id: '5fe7e3728d0d0211a6da824ca94542956decef0a42acd0b28ea718642134d717',
                  name: 'Relatives',
                },
                {
                  id: '808e687d7ad6c34e723f664c442c0befc2a095ac4c3df8026d6013e16b678d0a',
                  name: 'Colleagues',
                },
                {
                  id: 'f0fb48800768242a54f96b29db8eac2da1f2a8fa1b9d14f9d2a8be7ad09c6797',
                  name: 'Alone',
                },
              ],
              multiple: false,
              alignment: true,
              required: true,
              alias: 'why',
            },
          },
          {
            id: 'db1eab28f31c0e19a050469e9bff0e7661024a3fe7702a5fa52e2688e2a2682e',
            name: 'Where do you drink mostly? 🌃',
            nameVisible: true,
            description: '',
            slots: [
              {
                id: '91209d7ff7b0e4b7f2d71fc5d9f9effe3e64ecc0a01dd961f0195785b98e1a8a',
                type: 'string',
                kind: 'static',
                reference: 'choice',
                label: 'Choice',
                alias: 'why',
                required: true,
              },
            ],
            block: {
              type: 'tripetto-block-multiple-choice',
              version: '5.2.3',
              choices: [
                {
                  id: '6dd27b6e65de737e69eb57a22876807119499daaebe6755e14b8d15b6c98821d',
                  name: 'Restaurants',
                },
                {
                  id: '207e7ad031a93e62e3e79696d01b746f22aa9e448a38399be9dbd591b521b8c9',
                  name: 'Bars',
                },
                {
                  id: 'c72092a03a37735133ff3da3036ae39d2403a90ce24482c7d9d08906cea1cfce',
                  name: 'Business events meetings',
                },
                {
                  id: '5fe7e3728d0d0211a6da824ca94542956decef0a42acd0b28ea718642134d717',
                  name: 'Parties',
                },
                {
                  id: '808e687d7ad6c34e723f664c442c0befc2a095ac4c3df8026d6013e16b678d0a',
                  name: 'At home',
                },
              ],
              multiple: false,
              alignment: true,
              required: true,
              alias: 'why',
            },
          },
          {
            id: '5b00634bae57caf13a2825f09a7ff5aadab4e18f143074698b960c5357b2bbe6',
            name: "How often can't you stop when you start drinking? ❌",
            nameVisible: true,
            description: '',
            slots: [
              {
                id: 'a017b03bcdda50b5d1b0f86503a27a0962f6ae1f027276dd001b233beecf2269',
                type: 'string',
                kind: 'static',
                reference: 'choice',
                label: 'Choice',
                alias: 'why',
                required: true,
              },
            ],
            block: {
              type: 'tripetto-block-multiple-choice',
              version: '5.2.3',
              choices: [
                {
                  id: '6dd27b6e65de737e69eb57a22876807119499daaebe6755e14b8d15b6c98821d',
                  name: 'Every time',
                },
                {
                  id: '207e7ad031a93e62e3e79696d01b746f22aa9e448a38399be9dbd591b521b8c9',
                  name: 'Once a week',
                },
                {
                  id: 'c72092a03a37735133ff3da3036ae39d2403a90ce24482c7d9d08906cea1cfce',
                  name: 'Once a month',
                },
                {
                  id: '5fe7e3728d0d0211a6da824ca94542956decef0a42acd0b28ea718642134d717',
                  name: 'A couple of times a year',
                },
                {
                  id: '808e687d7ad6c34e723f664c442c0befc2a095ac4c3df8026d6013e16b678d0a',
                  name: 'Once a year',
                },
                {
                  id: 'ccf5f7280eebfca55a723281dbbe5b8f54989d1be391eae54e8166987967b10b',
                  name: 'Never',
                },
              ],
              multiple: false,
              alignment: true,
              required: true,
              alias: 'why',
            },
          },
          {
            id: '395295206f2b1ff7cf397c7cd8219354a0283aa98426bfb801658ace45bd1106',
            name: 'How often in the past year have you experienced alcohol-related regret? 😔',
            nameVisible: true,
            description: '',
            slots: [
              {
                id: 'c57329860d94783086adc51e661921de36c1b891037c62c5ea6b00ab8e76b40e',
                type: 'string',
                kind: 'static',
                reference: 'choice',
                label: 'Choice',
                alias: 'why',
                required: true,
              },
            ],
            block: {
              type: 'tripetto-block-multiple-choice',
              version: '5.2.3',
              choices: [
                {
                  id: '6dd27b6e65de737e69eb57a22876807119499daaebe6755e14b8d15b6c98821d',
                  name: 'Every time I drink',
                },
                {
                  id: '207e7ad031a93e62e3e79696d01b746f22aa9e448a38399be9dbd591b521b8c9',
                  name: 'Once a week',
                },
                {
                  id: 'c72092a03a37735133ff3da3036ae39d2403a90ce24482c7d9d08906cea1cfce',
                  name: 'Once a month',
                },
                {
                  id: '5fe7e3728d0d0211a6da824ca94542956decef0a42acd0b28ea718642134d717',
                  name: 'A couple of times a year',
                },
                {
                  id: '808e687d7ad6c34e723f664c442c0befc2a095ac4c3df8026d6013e16b678d0a',
                  name: 'Once a year',
                },
                {
                  id: 'ccf5f7280eebfca55a723281dbbe5b8f54989d1be391eae54e8166987967b10b',
                  name: 'Never',
                },
              ],
              multiple: false,
              alignment: true,
              required: true,
              alias: 'why',
            },
          },
          {
            id: '01c293005c1a704b622bd1568abf3c253b96c4ac50b7f74afdfc696fba1740eb',
            name: 'Have you ever tried to quit drinking?',
            nameVisible: true,
            description: '',
            slots: [
              {
                id: '9b5177bb6bc3174ec6f0db19ce3447be0835e9a74b861d7f038e5253223d5129',
                type: 'string',
                kind: 'static',
                reference: 'choice',
                label: 'Choice',
                alias: 'why',
                required: true,
              },
            ],
            block: {
              type: 'tripetto-block-multiple-choice',
              version: '5.2.3',
              choices: [
                {
                  id: '6dd27b6e65de737e69eb57a22876807119499daaebe6755e14b8d15b6c98821d',
                  name: 'Yes',
                },
                {
                  id: '207e7ad031a93e62e3e79696d01b746f22aa9e448a38399be9dbd591b521b8c9',
                  name: 'No',
                },
              ],
              multiple: false,
              alignment: true,
              required: true,
              alias: 'why',
            },
          },
          {
            id: '2abb1d604dcb1a995d3e792ecd8849d092ca8cd8660916758c2d914fffe89b21',
            name: '@d608f967f146840dd25baceb3f9023296bd7a3ab42794c544f653275a821fdc4, may I ask how much are you concerned about your drinking?',
            nameVisible: true,
            description: 'Score from 1 to 5',
            slots: [
              {
                id: '813ddac5d29d9c4221b05662bdf17e8ce3a55851bb01b00716a66a741794bc5d',
                type: 'string',
                kind: 'static',
                reference: 'choice',
                label: 'Choice',
                alias: 'concern',
                required: true,
              },
            ],
            block: {
              type: 'tripetto-block-multiple-choice',
              version: '5.2.3',
              choices: [
                {
                  id: '7f41f0f55f4a5c1a18a1707ad2b40b391f077f5e171796e46d011d30907e0647',
                  name: '1 — Not at all',
                  value: '',
                },
                {
                  id: 'a6d988bf15bf69bca67241c3f6ee66a7fdb6d11fe54ae69659fd07997b77507a',
                  name: '2 — A little bit',
                },
                {
                  id: 'c390f8caf37d2f3805c772ea7006fe75f8c0d00fc1fe775e781c9ace64643b31',
                  name: '3 — Definitely concerned',
                },
                {
                  id: '2bba5acc264e254c6e525eb8e8619bb7ea45fc9405bb3390a4df8c48c588fda7',
                  name: '4 — Strongly concerned',
                },
                {
                  id: 'b0039fda703b04fc4d2e4a236f6dc7842811c1a4f20298682e97cf99974b5a6a',
                  name: "5 — I'm desperate",
                },
              ],
              multiple: false,
              alignment: true,
              required: true,
              alias: 'concern',
            },
          },
          {
            id: '3f65111e05a581e497781b9a9cf541bae443973f02333d239cecc954208c8553',
            name: 'Thanks for the honest answers! 🙏',
            nameVisible: true,
            description:
              "When dealing with drinking issues, it's essential to be completely honest with yourself. \n\nWe judge no one and motivate you to look deeply inside yourself to find the right answers to your questions.",
          },
          {
            id: 'f1644db562dc264dc5bec27be1a40721d2e4f9b2d717ea0bea82e827096f2768',
            name: 'Now please, tell me more about your goal 🎯',
            nameVisible: true,
            description: 'What do you want to achieve with Sober One?',
            slots: [
              {
                id: '03c4aa779e164f006071bed323f3a2211a718cde3acd159085b2a5b9c96db3d3',
                type: 'string',
                kind: 'static',
                reference: 'choice',
                label: 'Choice',
                alias: 'why',
                required: true,
              },
            ],
            block: {
              type: 'tripetto-block-multiple-choice',
              version: '5.2.3',
              choices: [
                {
                  id: '6dd27b6e65de737e69eb57a22876807119499daaebe6755e14b8d15b6c98821d',
                  name: 'Drink less',
                },
                {
                  id: '207e7ad031a93e62e3e79696d01b746f22aa9e448a38399be9dbd591b521b8c9',
                  name: 'Control my drinking',
                },
                {
                  id: 'c72092a03a37735133ff3da3036ae39d2403a90ce24482c7d9d08906cea1cfce',
                  name: 'Prepare to quit',
                },
                {
                  id: '5fe7e3728d0d0211a6da824ca94542956decef0a42acd0b28ea718642134d717',
                  name: 'I already quitted, but I need support',
                },
              ],
              multiple: false,
              alignment: true,
              required: true,
              alias: 'why',
            },
          },
          {
            id: 'dfc7335c496be2ca64606f7078f5703f41f40ab490bc2043e754e7643f55da84',
            name: "Noted 👌 It's pretty good intention!",
            nameVisible: true,
            description:
              'We developed Sober One together with mental health professionals to become your daily support.\n\nSober One is full of free tools and content to help you succeed!',
          },
          {
            id: 'aa79021f4f51d49143f759b4ef0596bce092e6e8916014a23c9548140968e200',
            name: 'How important is it to achieve this goal?',
            nameVisible: true,
            description: 'Score from 1 to 5',
            slots: [
              {
                id: '65aecb75a47d36f6eec200a50cbbfd70e7e9031b4ae8c86938a5e88bc6a878f5',
                type: 'string',
                kind: 'static',
                reference: 'choice',
                label: 'Choice',
                alias: 'why',
                required: true,
              },
            ],
            block: {
              type: 'tripetto-block-multiple-choice',
              version: '5.2.3',
              choices: [
                {
                  id: '6dd27b6e65de737e69eb57a22876807119499daaebe6755e14b8d15b6c98821d',
                  name: "1 — Not at all. I'm just curious",
                },
                {
                  id: '207e7ad031a93e62e3e79696d01b746f22aa9e448a38399be9dbd591b521b8c9',
                  name: '2 — Slightly important',
                },
                {
                  id: 'c72092a03a37735133ff3da3036ae39d2403a90ce24482c7d9d08906cea1cfce',
                  name: '3 — Definitely important',
                },
                {
                  id: '5fe7e3728d0d0211a6da824ca94542956decef0a42acd0b28ea718642134d717',
                  name: '4 — Very important',
                },
                {
                  id: '808e687d7ad6c34e723f664c442c0befc2a095ac4c3df8026d6013e16b678d0a',
                  name: "5 — It's vital",
                },
              ],
              multiple: false,
              alignment: true,
              required: true,
              alias: 'why',
            },
          },
          {
            id: '0907c8a779ab98e57349688ebb29d9a6075274b73c33ebe5c6ae11abb84cee97',
            explanation: 'You can choose more than one option',
            name: 'Are there any other areas where we can help you?',
            nameVisible: true,
            description: 'Sober One can aid with other mental health and well-being issues 🏄',
            slots: [
              {
                id: 'f589abf562904eba853a30af32386b14154c2a1aba9d2605c0c0a5f13a8726da',
                type: 'boolean',
                kind: 'dynamic',
                reference: '9044d79361ab6a5cbbec7923ac95206ce16998d8f9e4a6e1ace9e828c1815538',
                sequence: 0,
                label: 'Choice',
                name: 'Smoking',
                pipeable: {
                  label: 'Choice',
                  content: 'name',
                  alias: 'other',
                  legacy: 'Choice',
                },
                labelForFalse: 'Not selected',
                labelForTrue: 'Selected',
              },
              {
                id: 'b555d7eeb321f83bfc0cd36395b1b6ce330dd04d91670020c92efd64bc58ea02',
                type: 'boolean',
                kind: 'dynamic',
                reference: 'cc4eae67ee2ae31de8cf97a49ff39232c33d474dabc7e144fb0bda0d8d6d11a5',
                sequence: 1,
                label: 'Choice',
                name: 'Drugs',
                pipeable: {
                  label: 'Choice',
                  content: 'name',
                  alias: 'other',
                  legacy: 'Choice',
                },
                labelForFalse: 'Not selected',
                labelForTrue: 'Selected',
              },
              {
                id: 'c3480966a69b6af2ba87a89b1fa12cd10d33878a84b4fee851099bde41aaa989',
                type: 'boolean',
                kind: 'dynamic',
                reference: 'df12f3f09cb8f188c0d1d53cd95430c696f931ed87961451ffb7a9a3810dbc6a',
                sequence: 2,
                label: 'Choice',
                name: 'Binge eating',
                pipeable: {
                  label: 'Choice',
                  content: 'name',
                  alias: 'other',
                  legacy: 'Choice',
                },
                labelForFalse: 'Not selected',
                labelForTrue: 'Selected',
              },
              {
                id: 'd87e69669dcad7a7029dcb70921636c7aa1a6d98601236d2b7626d6805aaf3f6',
                type: 'boolean',
                kind: 'dynamic',
                reference: '1d27dc590056811e58955464745dfd4ad66f1c61721724bf0aa342efb909e480',
                sequence: 3,
                label: 'Choice',
                name: 'Relationships',
                pipeable: {
                  label: 'Choice',
                  content: 'name',
                  alias: 'other',
                  legacy: 'Choice',
                },
                labelForFalse: 'Not selected',
                labelForTrue: 'Selected',
              },
              {
                id: 'e02ec8e3f66730fade7c36db0b7f615d5427a62322984c2b57e6feff07d56b95',
                type: 'boolean',
                kind: 'dynamic',
                reference: '7efca08ec36e4fb5ee988a8ddbff05e1b0c3f6e02d7ac80c23a9c0b888c93a12',
                sequence: 4,
                label: 'Choice',
                name: 'Depression',
                pipeable: {
                  label: 'Choice',
                  content: 'name',
                  alias: 'other',
                  legacy: 'Choice',
                },
                labelForFalse: 'Not selected',
                labelForTrue: 'Selected',
              },
              {
                id: '539fa09b5ded0b252ab8f0fbe462e2fe0dc09840ca5f7d0b70aac06fe06d8c51',
                type: 'boolean',
                kind: 'dynamic',
                reference: 'f73ff0eb6cc9a49db38b064252a54f98befc962e437c32537a1829a9a8c0584a',
                sequence: 5,
                label: 'Choice',
                name: 'Anxiety',
                pipeable: {
                  label: 'Choice',
                  content: 'name',
                  alias: 'other',
                  legacy: 'Choice',
                },
                labelForFalse: 'Not selected',
                labelForTrue: 'Selected',
              },
              {
                id: '745935266b2cd9bd909a04842333a829b795d82e484e9251c4d46a3c3dbd7c6a',
                type: 'boolean',
                kind: 'dynamic',
                reference: 'b5bb2fe7c0e0a9055dfad521056c7fbd4cd446660aae4c190f64302993f54a77',
                sequence: 6,
                label: 'Choice',
                name: 'Distress',
                pipeable: {
                  label: 'Choice',
                  content: 'name',
                  alias: 'other',
                  legacy: 'Choice',
                },
                labelForFalse: 'Not selected',
                labelForTrue: 'Selected',
              },
              {
                id: '0c3bf3dddefb8b07f970bb5a05d6527269f6e8e938cb1521434e2bcf8940d070',
                type: 'boolean',
                kind: 'dynamic',
                reference: 'bf3163530b45bac00d155a90787acfc83029894be36546d36bb92b740813b759',
                sequence: 7,
                label: 'Choice',
                name: 'Productivity',
                pipeable: {
                  label: 'Choice',
                  content: 'name',
                  alias: 'other',
                  legacy: 'Choice',
                },
                labelForFalse: 'Not selected',
                labelForTrue: 'Selected',
              },
              {
                id: 'd4e9bda6be74d4acc9675ba183eb2690e355d2dcfe8b113a25a0dc5df0fb2168',
                type: 'number',
                kind: 'feature',
                reference: 'counter',
                label: 'Counter',
                exportable: false,
              },
            ],
            block: {
              type: 'tripetto-block-multiple-choice',
              version: '5.2.3',
              choices: [
                {
                  id: '9044d79361ab6a5cbbec7923ac95206ce16998d8f9e4a6e1ace9e828c1815538',
                  name: 'Smoking',
                },
                {
                  id: 'cc4eae67ee2ae31de8cf97a49ff39232c33d474dabc7e144fb0bda0d8d6d11a5',
                  name: 'Drugs',
                },
                {
                  id: 'df12f3f09cb8f188c0d1d53cd95430c696f931ed87961451ffb7a9a3810dbc6a',
                  name: 'Binge eating',
                },
                {
                  id: '1d27dc590056811e58955464745dfd4ad66f1c61721724bf0aa342efb909e480',
                  name: 'Relationships',
                },
                {
                  id: '7efca08ec36e4fb5ee988a8ddbff05e1b0c3f6e02d7ac80c23a9c0b888c93a12',
                  name: 'Depression',
                },
                {
                  id: 'f73ff0eb6cc9a49db38b064252a54f98befc962e437c32537a1829a9a8c0584a',
                  name: 'Anxiety',
                },
                {
                  id: 'b5bb2fe7c0e0a9055dfad521056c7fbd4cd446660aae4c190f64302993f54a77',
                  name: 'Distress',
                },
                {
                  id: 'bf3163530b45bac00d155a90787acfc83029894be36546d36bb92b740813b759',
                  name: 'Productivity',
                },
              ],
              multiple: true,
              alignment: true,
              alias: 'other',
            },
          },
          {
            id: '4eabe6934ec532fa59e871779141427abe420eb3d096564463dc6d6e7b4a6205',
            name: 'This is it, @d608f967f146840dd25baceb3f9023296bd7a3ab42794c544f653275a821fdc4!',
            nameVisible: true,
            description:
              "You're ready to start your journey with Sober One.\n\nUse the app every day, track your drinking daily, read articles, and complete tasks, and eventually, you will find yourself a new person.\n\nWish you good luck!👋",
          },
        ],
      },
    ],
    builder: { name: 'tripetto', version: '4.5.0' },
  },
  ru: {
    name: 'Onboarding RU',
    clusters: [
      {
        id: '7e9d7434dc69cf5d94a54b353361f30a5d81b2296718345f847c23d848f23466',
        nodes: [
          {
            id: 'ab9e91fa395a1dbfa2283081999c9b701ed9c331add81a47b9467357f47001ed',
            name: 'Привет!🤖',
            nameVisible: true,
            description:
              'Я Собербот! Я проведу вас через короткое знакомство и задам пару вопросов, чтобы сделать Sober One более персонализированным для вас.\n\nИдет?',
          },
          {
            id: '7e0d7ef323b078447cd1120775f75bed5b23abe0d43a95cdfda551916870cf98',
            name: 'Как я могу к вам обращаться?',
            nameVisible: true,
            description: 'Мы уважаем право на тайну частной жизни, поэтому вы можете использовать псевдоним.',
            slots: [
              {
                id: 'd608f967f146840dd25baceb3f9023296bd7a3ab42794c544f653275a821fdc4',
                type: 'text',
                kind: 'static',
                reference: 'value',
                label: 'Text',
                alias: 'name',
                required: true,
                transformation: 'capitalize',
              },
            ],
            block: { type: 'tripetto-block-text', version: '2.0.0' },
          },
          {
            id: 'cb079ecf16e2872b4e69b1f5f5f17cce035a791632f1604f15289a155d84ba7b',
            name: 'Отлично, @d608f967f146840dd25baceb3f9023296bd7a3ab42794c544f653275a821fdc4, я рад, что вы здесь!',
            nameVisible: true,
            description:
              'Позвольте мне рассказать немного о нас.\n\nSober One — приложение, посвященное теме употребления алкоголя. Мы не предлагаем вам бросать или даже признавать проблему.\n\nМы только даем вам инструмент повысить осознанность и в конце концов достичь ваши собственные цели.',
          },
          {
            id: 'f1644db562dc264dc5bec27be1a40721d2e4f9b2d717ea0bea82e827096f2768',
            name: 'Итак, почему вы здесь?',
            nameVisible: true,
            description: 'Чего вы бы хотели достичь с Sober One?',
            slots: [
              {
                id: '03c4aa779e164f006071bed323f3a2211a718cde3acd159085b2a5b9c96db3d3',
                type: 'string',
                kind: 'static',
                reference: 'choice',
                label: 'Choice',
                alias: 'why',
              },
            ],
            block: {
              type: 'tripetto-block-multiple-choice',
              version: '1.0.2',
              choices: [
                {
                  id: '6dd27b6e65de737e69eb57a22876807119499daaebe6755e14b8d15b6c98821d',
                  name: 'Пить меньше',
                },
                {
                  id: '207e7ad031a93e62e3e79696d01b746f22aa9e448a38399be9dbd591b521b8c9',
                  name: 'Контролировать употребление',
                },
                {
                  id: 'c72092a03a37735133ff3da3036ae39d2403a90ce24482c7d9d08906cea1cfce',
                  name: 'Бросить пить',
                },
                {
                  id: '5fe7e3728d0d0211a6da824ca94542956decef0a42acd0b28ea718642134d717',
                  name: 'Уже не пью, нужна поддержка',
                },
              ],
              multiple: false,
              required: true,
              alias: 'why',
            },
          },
          {
            id: 'dfc7335c496be2ca64606f7078f5703f41f40ab490bc2043e754e7643f55da84',
            name: 'Хорошо👌 Вполне достойная цель.',
            nameVisible: true,
            description:
              'В Sober One много инструментов и контента, которые помогут вам достичь её. \n\nОни созданы профессиональными разработчиками и психиатрами и станут вашей ежедневной поддержкой.',
          },
          {
            id: '2abb1d604dcb1a995d3e792ecd8849d092ca8cd8660916758c2d914fffe89b21',
            name: '@d608f967f146840dd25baceb3f9023296bd7a3ab42794c544f653275a821fdc4, насколько вы обеспокоены своим употреблением?',
            nameVisible: true,
            slots: [
              {
                id: '813ddac5d29d9c4221b05662bdf17e8ce3a55851bb01b00716a66a741794bc5d',
                type: 'string',
                kind: 'static',
                reference: 'choice',
                label: 'Choice',
                alias: 'concern',
              },
            ],
            block: {
              type: 'tripetto-block-multiple-choice',
              version: '1.0.2',
              choices: [
                {
                  id: '7f41f0f55f4a5c1a18a1707ad2b40b391f077f5e171796e46d011d30907e0647',
                  name: 'Совсем нет',
                  value: '',
                },
                {
                  id: 'a6d988bf15bf69bca67241c3f6ee66a7fdb6d11fe54ae69659fd07997b77507a',
                  name: 'Немного',
                },
                {
                  id: 'c390f8caf37d2f3805c772ea7006fe75f8c0d00fc1fe775e781c9ace64643b31',
                  name: 'Средне',
                },
                {
                  id: '2bba5acc264e254c6e525eb8e8619bb7ea45fc9405bb3390a4df8c48c588fda7',
                  name: 'Довольно сильно',
                },
                {
                  id: 'b0039fda703b04fc4d2e4a236f6dc7842811c1a4f20298682e97cf99974b5a6a',
                  name: 'Я в отчаянии',
                },
              ],
              multiple: false,
              required: true,
              alias: 'concern',
            },
          },
          {
            id: '3f65111e05a581e497781b9a9cf541bae443973f02333d239cecc954208c8553',
            name: 'Спасибо за искренний ответ!🙏',
            nameVisible: true,
            description:
              'Когда вы хотите разобраться в своих отношениях с алкоголем, предельная честность очень важна.\n\nМы никогда и никого не осуждаем и стараемся мотивировать заглянуть вглубь себя, чтобы найти ответы на свои вопросы.',
          },
          {
            id: '0907c8a779ab98e57349688ebb29d9a6075274b73c33ebe5c6ae11abb84cee97',
            explanation: 'Можно выбрать несколько вариантов.',
            name: 'Есть ли еще какие-то темы, которые вас волнуют?',
            nameVisible: true,
            description:
              'Несмотря на то, что Sober One разработана для употребляющих алкоголь, многие её методы могут быть использованы в других областях.',
            slots: [
              {
                id: 'f589abf562904eba853a30af32386b14154c2a1aba9d2605c0c0a5f13a8726da',
                type: 'boolean',
                kind: 'dynamic',
                reference: '9044d79361ab6a5cbbec7923ac95206ce16998d8f9e4a6e1ace9e828c1815538',
                sequence: 0,
                label: 'Choice',
                name: 'Курение',
                pipable: {
                  group: 'Choice',
                  label: 'Choice',
                  template: 'name',
                  alias: 'other',
                },
              },
              {
                id: 'aa53670d581f2e5e10da0df3f1dc9d05ebe241d815e63b085fef53b614ffba9a',
                type: 'boolean',
                kind: 'dynamic',
                reference: 'f3a5eb150590b03df29e4d474aa7449f9872a2ee30e9cff9b18fc65057af0c25',
                sequence: 1,
                label: 'Choice',
                name: 'Наркотики',
                pipable: {
                  group: 'Choice',
                  label: 'Choice',
                  template: 'name',
                  alias: 'other',
                },
              },
              {
                id: 'c3480966a69b6af2ba87a89b1fa12cd10d33878a84b4fee851099bde41aaa989',
                type: 'boolean',
                kind: 'dynamic',
                reference: 'df12f3f09cb8f188c0d1d53cd95430c696f931ed87961451ffb7a9a3810dbc6a',
                sequence: 2,
                label: 'Choice',
                name: 'Переедание',
                pipable: {
                  group: 'Choice',
                  label: 'Choice',
                  template: 'name',
                  alias: 'other',
                },
              },
              {
                id: 'd87e69669dcad7a7029dcb70921636c7aa1a6d98601236d2b7626d6805aaf3f6',
                type: 'boolean',
                kind: 'dynamic',
                reference: '1d27dc590056811e58955464745dfd4ad66f1c61721724bf0aa342efb909e480',
                sequence: 3,
                label: 'Choice',
                name: 'Отношения',
                pipable: {
                  group: 'Choice',
                  label: 'Choice',
                  template: 'name',
                  alias: 'other',
                },
              },
              {
                id: 'e02ec8e3f66730fade7c36db0b7f615d5427a62322984c2b57e6feff07d56b95',
                type: 'boolean',
                kind: 'dynamic',
                reference: '7efca08ec36e4fb5ee988a8ddbff05e1b0c3f6e02d7ac80c23a9c0b888c93a12',
                sequence: 4,
                label: 'Choice',
                name: 'Депрессия',
                pipable: {
                  group: 'Choice',
                  label: 'Choice',
                  template: 'name',
                  alias: 'other',
                },
              },
              {
                id: '539fa09b5ded0b252ab8f0fbe462e2fe0dc09840ca5f7d0b70aac06fe06d8c51',
                type: 'boolean',
                kind: 'dynamic',
                reference: 'f73ff0eb6cc9a49db38b064252a54f98befc962e437c32537a1829a9a8c0584a',
                sequence: 5,
                label: 'Choice',
                name: 'Тревога',
                pipable: {
                  group: 'Choice',
                  label: 'Choice',
                  template: 'name',
                  alias: 'other',
                },
              },
              {
                id: '745935266b2cd9bd909a04842333a829b795d82e484e9251c4d46a3c3dbd7c6a',
                type: 'boolean',
                kind: 'dynamic',
                reference: 'b5bb2fe7c0e0a9055dfad521056c7fbd4cd446660aae4c190f64302993f54a77',
                sequence: 6,
                label: 'Choice',
                name: 'Стресс',
                pipable: {
                  group: 'Choice',
                  label: 'Choice',
                  template: 'name',
                  alias: 'other',
                },
              },
              {
                id: '0c3bf3dddefb8b07f970bb5a05d6527269f6e8e938cb1521434e2bcf8940d070',
                type: 'boolean',
                kind: 'dynamic',
                reference: 'bf3163530b45bac00d155a90787acfc83029894be36546d36bb92b740813b759',
                sequence: 7,
                label: 'Choice',
                name: 'Продуктивность',
                pipable: {
                  group: 'Choice',
                  label: 'Choice',
                  template: 'name',
                  alias: 'other',
                },
              },
            ],
            block: {
              type: 'tripetto-block-multiple-choice',
              version: '1.0.2',
              choices: [
                {
                  id: '9044d79361ab6a5cbbec7923ac95206ce16998d8f9e4a6e1ace9e828c1815538',
                  name: 'Курение',
                },
                {
                  id: 'f3a5eb150590b03df29e4d474aa7449f9872a2ee30e9cff9b18fc65057af0c25',
                  name: 'Наркотики',
                },
                {
                  id: 'df12f3f09cb8f188c0d1d53cd95430c696f931ed87961451ffb7a9a3810dbc6a',
                  name: 'Переедание',
                },
                {
                  id: '1d27dc590056811e58955464745dfd4ad66f1c61721724bf0aa342efb909e480',
                  name: 'Отношения',
                },
                {
                  id: '7efca08ec36e4fb5ee988a8ddbff05e1b0c3f6e02d7ac80c23a9c0b888c93a12',
                  name: 'Депрессия',
                },
                {
                  id: 'f73ff0eb6cc9a49db38b064252a54f98befc962e437c32537a1829a9a8c0584a',
                  name: 'Тревога',
                },
                {
                  id: 'b5bb2fe7c0e0a9055dfad521056c7fbd4cd446660aae4c190f64302993f54a77',
                  name: 'Стресс',
                },
                {
                  id: 'bf3163530b45bac00d155a90787acfc83029894be36546d36bb92b740813b759',
                  name: 'Продуктивность',
                },
              ],
              multiple: true,
              alignment: true,
              alias: 'other',
            },
          },
          {
            id: '4eabe6934ec532fa59e871779141427abe420eb3d096564463dc6d6e7b4a6205',
            name: 'Ну вот и все, @d608f967f146840dd25baceb3f9023296bd7a3ab42794c544f653275a821fdc4!',
            nameVisible: true,
            description:
              'Вы готовы к использованию Sober One.\n\nЗаходите в приложение каждый день, отмечайте случаи употребления, читайте статьи и выполняйте задания и в какой-то момент вы увидите, что становитесь новым человеком.\n\nЖелаем вам удачи!👋',
          },
        ],
      },
    ],
    editor: { name: 'tripetto', version: '1.7.1' },
  },
}
