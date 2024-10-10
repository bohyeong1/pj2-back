const mongoose = require('mongoose')
const {Schema} = mongoose

const structureSchema = new Schema({
    name : {
        type : String,
        require : true
    },
    structure : {
        type : Array,
        require : true
    },
    createAt : {
        type : Date,
        default : Date.now,
    },
    modifyAt : {
        type : Date,
    }
})

const Structure = mongoose.model('Structure', structureSchema)

module.exports = Structure


// const acc_structure = new Structure({
//     name : 'checkout_method',
//     structure : [
//         {
//             name : '가전제품 전원 끄기',
//             url : 'data:image/png;base64,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',
//             text : ''
//         },
//         {
//             name : '문 잠그기',
//             url : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABv0lEQVR4nO2YT0oDMRSHPxBE0BOIrV2Ih1APoCvBhXoHreIVFK0utGsR3FXFA6hHKbhTa11boQU7RgJvYChTpp2/Cc0HD4Yweclv3stLJuBwWEMZqAIvQBP4EWtK2z5QwmAWgGugD6gI84BHoIJhbMlX15PsAg1gG1gGZsX08w5wB/Tk3Q6wiSEcAX8ysYakVhSLwH0gOocYEAkP+AX2YvSvSl+vyMiUAukUR4TPgfj4BuYpgNtAOiXlQXzdkDNlqU7dEddEFBUpAH2pfrlRTTEaPv7iT5KmY/Msg+oSmxa74vOJHHmVQZdS9Kn3GSUngNzoyKBzKfrUvvxNMjf8o4YtfofihESgXEQmIbWmgQvgc4T/i6ytBdRkTmNzboAANWBncYS0pPMKxbMaiIz5FSSr+TghGaFcRHBrJBOUSy2SpdYMUAfacjq4kjbrIlIP2ZkvbRTSDhHyZaOQ9xAhbzYKOQkRcmyjkKkQIbrNyvKrBiwNX2PjhAxZ8EkWeuER2RAB2tYT+lLuiII7/WaCcqmFS61MUBOfWi35AvpyrGjWZC4fcTrXDLgiVQN2GkeIvjDWYvzIFGk6ElrE0Evsf2EQelGrxQnWAAAAAElFTkSuQmCC',
//             text : ''
//         },
//         {
//             name : '사용한 수건 한군데 모아놓기',
//             url : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABpUlEQVR4nO2Yu0rEQBSGP4igljbaaGVto5UvYeUFxCcIii8hWAt2gtY2+wQryK612FpsIyLYellF0MjACYS42SSzmZlVzwcDgUyS85//zBkmUEwEbAAt4B54AxJP4xW4BU6AZUZgFuh4DHzY+AKOgIm6IqKMiAdgF1gEpvDHNLAEHAB9icWIqcV6RsQ84VkF3sWZlToPtkSIcSIEa1IRfUnmKXAuMZk1U5k7eciUk2/2S9aLaQCVSbuTzzWBJO4D+ARiYAaYA44zQl7qvDB9yDeH8t2zAfcuq8R1U2Cjb65GaNFd84LrMRHyOIIQ0xx+EEqIabFJwcY3aRNXKCFl31UhvlFHbDPjCnXENjOuUEdsM+MKdcQ2M65QR2wz4wp1xDYzv9KRCNgCLoBnGeZ6U+7lqTvfnD12gLZLITHQG3Iq68kvowUZew3Nb1yI64Cz82OXQtrAdsHRM19CTzK/askNmq9dqzELG0K7VllmtGuhXQv9r/VvupZPVEhZZkKNxiqlG1BEx0fJh1o7KSokjzrSEImukb9eWsmY7jNUJeT+UrrPfAM/G2PvMWexygAAAABJRU5ErkJggg==',
//             text : ''
//         },
//         {
//             name : '쓰레기 버리기',
//             url : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABOklEQVR4nO2ZzUrEMBSFv27mIZRx6ysUWtqn82d8FRnciOtaSl9kcNwJ6r6RQETNtNKfTJOZuR/cTW4I53APlCYg/OECWAOfgLJKrz0AlwQs/q1FuF16z5IAWRuBj8BZS/8ceDJ77gmQDyNOC+1iafa8zyVqAdwB2x7RcF1bYGU0jGblQbiy6naKgVd9SF3Xam6qqvo9iVFE+oAoipQv+JnCeAOB1CiOz8Bc4MiApgrAwDMO8GXAGcdpII5jlSRJp5A+/TRN/Rhomkb9952Y0kcM7CITsJEIDUQiZCMRGohEyEYiNBCJkI1EaCASIRuJ0EAkQsFFSKP/d7MsU1306ed5vrMutxInc61yKAai7wPLslT7piiK/U3gUG6l2/DxRvaCQ248GLh2aWBhDtzMIHwDXE19nRSEU+ELdmzNNv8U2YkAAAAASUVORK5CYII=',
//             text : ''
//         },
//         {
//             name : '열쇠 반납하기',
//             url : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEMElEQVR4nO2aa4hVVRiGn2nUxMFLjKJOWDmpjT+c8U4hpuGkFoGXIVEQvIWiiP7I2x81SpCSIqYogqB+RKEgRgVK3lJkYEhKxVt5rdDxhto43nVGPng3LDfnbPeeNWc8O3phMWfvs87a613ru7zf2gP/g45AJTALmAtMBPqlaV3GAD8Bd4GmDO0osBhoT57iKeA7TfYy8CkwCSjXTrwMLAV+V59TwHDyDN2BA8B9YB3Q6RH9zczqgNvAG+QJ2gK1wB3tQFz0BA4CN4Ch5AFWy1RmN+O3TwMXtJu2II8NxUA9sCV0/zmgD/BEjDGmZwkKSVodMNKHyEINZI5sGAzscx5wQiE4CkZ2JfCFR/sbuOZDxsLseaAAeBb4V9c2sWUiYmF4GLlFb+AvHzLHgR/1+WvgJtDX+b6rfGAHuUdvHzL1IoBMqiZDH8stV2gdlAINwNWkweOsJmrYDvwDtAn1qdXO+eapOaHJvQiMc67NvKvlm18mfYBNcq8+T3MG6QIUAe/p3goPEiWSNTbORpF5HbilBPxWiMRXMaPlQ1inwXro+hMN1gjc0+dNGXYpjG4yi3CrEAmb9Lcab5euj8qU7fnbfEggrWQDvOPcGw18pBWaEGOMfsru2XKETfo19X3XEZ4lUth7fEkE2CGntxVMCjOJzZrsIsn9cBsY+s1YRcMARdJrXiQMZVrR3+QbSbBGq7mKPMFU+YRpphdi9Lda5DPHh7xXsyUxRSZ2Sz6SiVAXRZmTjl0/VrGYDc8D3ytqNSnPmA9tBQ5J6tv9Y8CbpAD9lTtMi+0H/lB0qVYSK8zBM4cAG4A/gZ3AfAWTVGGyTNp01s8Sq7bzH5AizHYCzTO6Zwn4GyVLq4vyHkvkjzU6/HAxWLsygzxGAbBWE92ipBjGeH1vZueFARKSdoa13KPNVOkcoFBVoU1yPdAuw7MtpP8KXJKMSQyzzXlOnmipdk+HHO00+SaRyRb93lcfk/7NqhkCAWeO9zbwknJLqUezuuMHjXtEf9dGhNZKObmF4sTopZBnB24LciA5ntQuN+q0MqocsCR8Oq7u66UYbfXIKJEw4fgquYMVVecivi9wzpxHxBnQip2L2r6geLoR49jHBx1URu+J6LMoiZIOSFxUnDYJf0bHQOYPSVGoemNIRLOi6heZ1fiIedkJzu448qfcIWE/DNDXg8ySmFGrQdEw224d1hsAM/lIlDokjFAYzSVTLIkxN6JNlhNnQ5BTquI8cJTOrTKR8CXjgyonp7QoWpNMhQ7+Dsu8SCOZVxSKz+f6vWQuyFiCG6vzrUaF40G0AsJkBiip1SnCJGn1TgS7DnwOdG4NEmEy9QqhDarpm/MOxA4Bp8V4P5lzMk0yjVSjTBroY1KOQdJmH5JiVDiqIDgcSB3KReCyBGAqUf5fIIHeYWQTmalCZdr+rYk04AHmCXlYdS3gaQAAAABJRU5ErkJggg==',
//             text : ''
//         },
//         {
//             name : '추가 요청 사항',
//             url : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB7klEQVR4nO2YS0oDQRCGPxLMxuQiRtAbqBcQI+IVRPF9CAkeQbNSo/eIJzCKxtcVFNSF2aSkpQaaMK8YJ9PG/qAgSVXP1E93VRcBqAAN4BUQR+0VOAbKxNBwING0dhQn5EWDZnCXWc3R5BpJoNZ1JClPL2TEyL/bEfkjFsnYCXEd8UIcQ/yOOIb4HSG+9Y26xcowOzI2QlxCvBDHEF8j+GLPBPHF7hjiix1f7JlwCbTGYURJ5F8IkQyn3zBKwCpwDnSADzXzuam+kutCloHnFOuegNqgQkZBATi08rgCtoEpYFKtCuwAbSuurmudERKI+ATW+pPrw/jWNTYQ44SQZUvE3ADr5i0xS3kLKVk1YXYijLjcNtT3CEwkBWfJqlUTUcdJYnIrAtfqX0kKzpILfe9WTIwk5Lar/rM0wVlxr+813SkKScitqv5O1n/r9JuZlwLe9LdKSOKS8g6q6HfzrO+Hj0pIK0shefEbR2vaPlp50dQkzI39UyH76j8hR4L22x6i/d7Y7TcvSjoAio4dYcQJ2VTfQ3Ah5knNGlHM2JGWBaAL9IBFHKFuidnQIxNFUXeiq2sOcIiCJUZ07NjVy66sZrrTnlUTPRURNynnhplizQCYdIeYmnDmOEVhitZ0IDM73QHvarfAqfpCC/sLdvy09mbC3VUAAAAASUVORK5CYII=',
//             text : ''
//         }
//     ]
// })

// acc_structure.save().then(console.log('structure set'))





