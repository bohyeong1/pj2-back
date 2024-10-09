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
//     name : 'discount_date',
//     structure : [
//         {
//             name : '스마트 도어락',
//             img : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABTklEQVR4nM2VPU4DMRCFv4oTgBQq0lKRdCBRIihooIE6ErkCRcIFoIOCNpyB0KVIzQ2yqaELtBSIgEZ6lqyV98+ORJ40Gnt27Df7bHngH7AF3ABjYCKz8RDYTN38EPgAfoCZRzBTbKGc6Mpt8wzYC3zvAHORRP3JUFXaRkXoKGcQQzCWFFXIgGdvfgQ8Ai/yNg9iKmsD7/IPMj/m8gx3wK9ke5W3+W0ZwQZwJb8v82M+wQnQA3aBU/me4qUEffkDj6AfIEBXeqnKlzrLSonegB3Jc5+L5QkugWsVYv6iiqAK00DeOfANnNVZ2OSQHY71vfAGxR5yI6RIVAv5hdvAk/ceOfuUTQJm+a26BJb8VbBRkVn+aG0IWkpuItGoTKLYx26lz3VXz8EgpeHMC0i6qQ0HtcOFqsw8bW1ssaSW6WDVmQSmsyOwscWSm/7K8QddRpTdRU+7RwAAAABJRU5ErkJggg==",
//             text : '게스트가 비밀번호나 앱을 이용해 와이파이에 연결된 도어록을 엽니다.'
//         },
//         {
//             name : '키패드',
//             img : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABTklEQVR4nM2VPU4DMRCFv4oTgBQq0lKRdCBRIihooIE6ErkCRcIFoIOCNpyB0KVIzQ2yqaELtBSIgEZ6lqyV98+ORJ40Gnt27Df7bHngH7AF3ABjYCKz8RDYTN38EPgAfoCZRzBTbKGc6Mpt8wzYC3zvAHORRP3JUFXaRkXoKGcQQzCWFFXIgGdvfgQ8Ai/yNg9iKmsD7/IPMj/m8gx3wK9ke5W3+W0ZwQZwJb8v82M+wQnQA3aBU/me4qUEffkDj6AfIEBXeqnKlzrLSonegB3Jc5+L5QkugWsVYv6iiqAK00DeOfANnNVZ2OSQHY71vfAGxR5yI6RIVAv5hdvAk/ceOfuUTQJm+a26BJb8VbBRkVn+aG0IWkpuItGoTKLYx26lz3VXz8EgpeHMC0i6qQ0HtcOFqsw8bW1ssaSW6WDVmQSmsyOwscWSm/7K8QddRpTdRU+7RwAAAABJRU5ErkJggg==',
//             text : '게스트가 호스트에게서 제공받은 비밀번호로 전자 도어락을 엽니다.'
//         },
//         {
//             name : '열쇠 보관함',
//             img : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEDUlEQVR4nNWY3YtVVRjGfxLqiM1oOufDyiQqPaBEXVhhQhLzLyQK3qiDl92LaaKIXng/lTdCN5HWddEnSticStEzzuSMkiMafkBlM4KGnhNLngUvm72P+5yz9jl7HlgX+91rvWs9a71fa0H30Q9sBT4BqsBt4D+128Co/m1R39xhBTAC3AMaKds94BjwMjnAIuAAMKvF1YFfgb3AJmANsFitItk+4DdDyJ3WEWBhr0i4nTxvCHwGrG5h/Grgc411On4CSnQZrwI3tYApYH0Hut4ErkjXNWAdXUJZE7qJvwOWRf4/AwwDXwKTMjvXJiXbqT4Wy4HvpXO6GyfTB5wxJOZH/OUD4J8Ujv43sEf6PJyuH4yZZeozB4w52ZN4DvjFLPQC8D6w1jj7KzqNr02/qsbak/FmdjjLEDsr57Q+4SLTDU3+F7ANmPcEXW8DlzTmeoTMW5rjAfBSFkRGNLGLThYlnYD7VwMKKfUtNX5RjZjZCcld8gyKfiWwekKILRgyF1ogswSY0DjnMx4VzeUs4GkCYqsmc8kuCe2S2WgCgI1mZyXfTEAck1KXscmAzDcas8PIPpTsYwKiKqWuxCADMrvU/6SRvSvZzwTEHSlNW4K0SuZ19f09Eg2d7BYB8UBKWym9WyFTVL9/jaxfsvsExIyUuuxNm2QmVN7E4QX1uWtkA1kQmZLSlW2MTXMy73TLtE5JqZuQDMjs1T+XCKPO7mq7YDgqpbs70FFIIPOUqa+2m/77JfuIgBiS0tMd6inEkBk2dZorWzzOSf4eAfG8Soa6yodQZGrK6NHTrkg2o8o5COzErh3PQOdopGj8InRWL2jXfPh0+eQR8EZAMjciZfwGnbwLuy8GmOdxkqpF7PmguVhZe24XJYVZj0HgD81xKDQJe8foMybxVcQcOsUC4EcTVNx3UBLu22IV8Kf+fxvoxXDQkLgaM2fLcArGmpDweM2QuawnnXaxwZjTtO75mZAY0B07rj7yD3QPgU9bfP6sKDrVjTkVQzidJzFmFJbNVTTuLrJQLyu+On6kULpH5Yx/MnXX1YrKjv0m2TU09lAIn2hGYtyEXncycSgasq20GeWJICHWkbhoSJQSSJRTbEJN1fGQarNTevKZ1a7f0m1vRGVHsIxto9OE3q28fMyU1c82IVEz/fz4rqKYsIg0JKIm0jMSJWNOF405WXkzc7Ikxpv0yxQlY/vtkCgbEj1D2ZAYb5PEhBnfExQjtr8iwVfS+kRSAOjqSZRjyOXeJ8odksiFT5CQ1KL5I9c+4eF3sxMSzfp1DQ1jFvaeHOewjTw5dhR+QWmeLht5cew4+EWleX/NhVMnwe7wnIhOSWjMteiUhCfdKXIXnZJgE1+zlpvoRBPY7B7XchWd4vA/2m3hT8EB1ZQAAAAASUVORK5CYII=',
//             text : '게스트가 호스트에게서 제공받은 비밀번호를 이용해 안에 열쇠가 든 작은 금고를 엽니다.'
//         },
//         {
//             name : '건물 상주 직원',
//             img : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEDUlEQVR4nNWY3YtVVRjGfxLqiM1oOufDyiQqPaBEXVhhQhLzLyQK3qiDl92LaaKIXng/lTdCN5HWddEnSticStEzzuSMkiMafkBlM4KGnhNLngUvm72P+5yz9jl7HlgX+91rvWs9a71fa0H30Q9sBT4BqsBt4D+128Co/m1R39xhBTAC3AMaKds94BjwMjnAIuAAMKvF1YFfgb3AJmANsFitItk+4DdDyJ3WEWBhr0i4nTxvCHwGrG5h/Grgc411On4CSnQZrwI3tYApYH0Hut4ErkjXNWAdXUJZE7qJvwOWRf4/AwwDXwKTMjvXJiXbqT4Wy4HvpXO6GyfTB5wxJOZH/OUD4J8Ujv43sEf6PJyuH4yZZeozB4w52ZN4DvjFLPQC8D6w1jj7KzqNr02/qsbak/FmdjjLEDsr57Q+4SLTDU3+F7ANmPcEXW8DlzTmeoTMW5rjAfBSFkRGNLGLThYlnYD7VwMKKfUtNX5RjZjZCcld8gyKfiWwekKILRgyF1ogswSY0DjnMx4VzeUs4GkCYqsmc8kuCe2S2WgCgI1mZyXfTEAck1KXscmAzDcas8PIPpTsYwKiKqWuxCADMrvU/6SRvSvZzwTEHSlNW4K0SuZ19f09Eg2d7BYB8UBKWym9WyFTVL9/jaxfsvsExIyUuuxNm2QmVN7E4QX1uWtkA1kQmZLSlW2MTXMy73TLtE5JqZuQDMjs1T+XCKPO7mq7YDgqpbs70FFIIPOUqa+2m/77JfuIgBiS0tMd6inEkBk2dZorWzzOSf4eAfG8Soa6yodQZGrK6NHTrkg2o8o5COzErh3PQOdopGj8InRWL2jXfPh0+eQR8EZAMjciZfwGnbwLuy8GmOdxkqpF7PmguVhZe24XJYVZj0HgD81xKDQJe8foMybxVcQcOsUC4EcTVNx3UBLu22IV8Kf+fxvoxXDQkLgaM2fLcArGmpDweM2QuawnnXaxwZjTtO75mZAY0B07rj7yD3QPgU9bfP6sKDrVjTkVQzidJzFmFJbNVTTuLrJQLyu+On6kULpH5Yx/MnXX1YrKjv0m2TU09lAIn2hGYtyEXncycSgasq20GeWJICHWkbhoSJQSSJRTbEJN1fGQarNTevKZ1a7f0m1vRGVHsIxto9OE3q28fMyU1c82IVEz/fz4rqKYsIg0JKIm0jMSJWNOF405WXkzc7Ikxpv0yxQlY/vtkCgbEj1D2ZAYb5PEhBnfExQjtr8iwVfS+kRSAOjqSZRjyOXeJ8odksiFT5CQ1KL5I9c+4eF3sxMSzfp1DQ1jFvaeHOewjTw5dhR+QWmeLht5cew4+EWleX/NhVMnwe7wnIhOSWjMteiUhCfdKXIXnZJgE1+zlpvoRBPY7B7XchWd4vA/2m3hT8EB1ZQAAAAASUVORK5CYII=',
//             text : '게스트의 출입을 도와줄 사람이 24시간 상주합니다.'
//         },
//         {
//             name : '호스트가 직접 맞이함',
//             img : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEMElEQVR4nO2aa4hVVRiGn2nUxMFLjKJOWDmpjT+c8U4hpuGkFoGXIVEQvIWiiP7I2x81SpCSIqYogqB+RKEgRgVK3lJkYEhKxVt5rdDxhto43nVGPng3LDfnbPeeNWc8O3phMWfvs87a613ru7zf2gP/g45AJTALmAtMBPqlaV3GAD8Bd4GmDO0osBhoT57iKeA7TfYy8CkwCSjXTrwMLAV+V59TwHDyDN2BA8B9YB3Q6RH9zczqgNvAG+QJ2gK1wB3tQFz0BA4CN4Ch5AFWy1RmN+O3TwMXtJu2II8NxUA9sCV0/zmgD/BEjDGmZwkKSVodMNKHyEINZI5sGAzscx5wQiE4CkZ2JfCFR/sbuOZDxsLseaAAeBb4V9c2sWUiYmF4GLlFb+AvHzLHgR/1+WvgJtDX+b6rfGAHuUdvHzL1IoBMqiZDH8stV2gdlAINwNWkweOsJmrYDvwDtAn1qdXO+eapOaHJvQiMc67NvKvlm18mfYBNcq8+T3MG6QIUAe/p3goPEiWSNTbORpF5HbilBPxWiMRXMaPlQ1inwXro+hMN1gjc0+dNGXYpjG4yi3CrEAmb9Lcab5euj8qU7fnbfEggrWQDvOPcGw18pBWaEGOMfsru2XKETfo19X3XEZ4lUth7fEkE2CGntxVMCjOJzZrsIsn9cBsY+s1YRcMARdJrXiQMZVrR3+QbSbBGq7mKPMFU+YRpphdi9Lda5DPHh7xXsyUxRSZ2Sz6SiVAXRZmTjl0/VrGYDc8D3ytqNSnPmA9tBQ5J6tv9Y8CbpAD9lTtMi+0H/lB0qVYSK8zBM4cAG4A/gZ3AfAWTVGGyTNp01s8Sq7bzH5AizHYCzTO6Zwn4GyVLq4vyHkvkjzU6/HAxWLsygzxGAbBWE92ipBjGeH1vZueFARKSdoa13KPNVOkcoFBVoU1yPdAuw7MtpP8KXJKMSQyzzXlOnmipdk+HHO00+SaRyRb93lcfk/7NqhkCAWeO9zbwknJLqUezuuMHjXtEf9dGhNZKObmF4sTopZBnB24LciA5ntQuN+q0MqocsCR8Oq7u66UYbfXIKJEw4fgquYMVVecivi9wzpxHxBnQip2L2r6geLoR49jHBx1URu+J6LMoiZIOSFxUnDYJf0bHQOYPSVGoemNIRLOi6heZ1fiIedkJzu448qfcIWE/DNDXg8ySmFGrQdEw224d1hsAM/lIlDokjFAYzSVTLIkxN6JNlhNnQ5BTquI8cJTOrTKR8CXjgyonp7QoWpNMhQ7+Dsu8SCOZVxSKz+f6vWQuyFiCG6vzrUaF40G0AsJkBiip1SnCJGn1TgS7DnwOdG4NEmEy9QqhDarpm/MOxA4Bp8V4P5lzMk0yjVSjTBroY1KOQdJmH5JiVDiqIDgcSB3KReCyBGAqUf5fIIHeYWQTmalCZdr+rYk04AHmCXlYdS3gaQAAAABJRU5ErkJggg==',
//             text : '게스트가 호스트나 공동 호스트를 만나 열쇠를 받습니다.'
//         },
//         {
//             name : '기타',
//             img : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEMElEQVR4nO2aa4hVVRiGn2nUxMFLjKJOWDmpjT+c8U4hpuGkFoGXIVEQvIWiiP7I2x81SpCSIqYogqB+RKEgRgVK3lJkYEhKxVt5rdDxhto43nVGPng3LDfnbPeeNWc8O3phMWfvs87a613ru7zf2gP/g45AJTALmAtMBPqlaV3GAD8Bd4GmDO0osBhoT57iKeA7TfYy8CkwCSjXTrwMLAV+V59TwHDyDN2BA8B9YB3Q6RH9zczqgNvAG+QJ2gK1wB3tQFz0BA4CN4Ch5AFWy1RmN+O3TwMXtJu2II8NxUA9sCV0/zmgD/BEjDGmZwkKSVodMNKHyEINZI5sGAzscx5wQiE4CkZ2JfCFR/sbuOZDxsLseaAAeBb4V9c2sWUiYmF4GLlFb+AvHzLHgR/1+WvgJtDX+b6rfGAHuUdvHzL1IoBMqiZDH8stV2gdlAINwNWkweOsJmrYDvwDtAn1qdXO+eapOaHJvQiMc67NvKvlm18mfYBNcq8+T3MG6QIUAe/p3goPEiWSNTbORpF5HbilBPxWiMRXMaPlQ1inwXro+hMN1gjc0+dNGXYpjG4yi3CrEAmb9Lcab5euj8qU7fnbfEggrWQDvOPcGw18pBWaEGOMfsru2XKETfo19X3XEZ4lUth7fEkE2CGntxVMCjOJzZrsIsn9cBsY+s1YRcMARdJrXiQMZVrR3+QbSbBGq7mKPMFU+YRpphdi9Lda5DPHh7xXsyUxRSZ2Sz6SiVAXRZmTjl0/VrGYDc8D3ytqNSnPmA9tBQ5J6tv9Y8CbpAD9lTtMi+0H/lB0qVYSK8zBM4cAG4A/gZ3AfAWTVGGyTNp01s8Sq7bzH5AizHYCzTO6Zwn4GyVLq4vyHkvkjzU6/HAxWLsygzxGAbBWE92ipBjGeH1vZueFARKSdoa13KPNVOkcoFBVoU1yPdAuw7MtpP8KXJKMSQyzzXlOnmipdk+HHO00+SaRyRb93lcfk/7NqhkCAWeO9zbwknJLqUezuuMHjXtEf9dGhNZKObmF4sTopZBnB24LciA5ntQuN+q0MqocsCR8Oq7u66UYbfXIKJEw4fgquYMVVecivi9wzpxHxBnQip2L2r6geLoR49jHBx1URu+J6LMoiZIOSFxUnDYJf0bHQOYPSVGoemNIRLOi6heZ1fiIedkJzu448qfcIWE/DNDXg8ySmFGrQdEw224d1hsAM/lIlDokjFAYzSVTLIkxN6JNlhNnQ5BTquI8cJTOrTKR8CXjgyonp7QoWpNMhQ7+Dsu8SCOZVxSKz+f6vWQuyFiCG6vzrUaF40G0AsJkBiip1SnCJGn1TgS7DnwOdG4NEmEy9QqhDarpm/MOxA4Bp8V4P5lzMk0yjVSjTBroY1KOQdJmH5JiVDiqIDgcSB3KReCyBGAqUf5fIIHeYWQTmalCZdr+rYk04AHmCXlYdS3gaQAAAABJRU5ErkJggg==',
//             text : '게스트가 여기에 나열되지 않은 다른 방법을 사용합니다.'
//         }
//     ]
// })

// acc_structure.save().then(console.log('structure set'))





