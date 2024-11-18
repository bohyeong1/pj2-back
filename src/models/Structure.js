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
//     name : 'evaluation',
//     structure :  [
//         {name:'cleanliness',
//         title:'청결도',
//         grade:null,
//         url:'data:image/png;base64,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'},
//         {name:'checkin',
//         title:'체크인',
//         grade:null,
//         url:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEZElEQVR4nO2aXYhVVRTHf6PGaI6ikZNQoZlhTCkRkwYhFaEkvRUVVtRLXwQJSYFEEfQQUY2mWVgvQQiRD5L6MkXYt1mWYWYfUJlZVJpjhVo4HycW/LcsDuece+7ZN88V5g+buWfvvf5nrbv3+tj7DoxiFKM4WRgDzAceAp4FXlVbDdwCTKLN0SnlfwOSgvYHsJQ2xbnAN07Zb4E1wP3ATcCNwIPAOxofBjZprIM2wXTgOyn4BXBNg/mPplboLWAKbYANUmgbMLmkzEzgXuBXyW6hZswBRoAjwDkV5GfIZ8yYRdSIh6XESy3gWE+N2CIlro/guFgce6kRu6VETwRHlzgGgbHUhD1Swpy3Ksa5CDaBU3hFxipg1LoiO2VIbwTHeeLYR414TUpY5q6KxeL4gBrxmJR4IoLjEXFYUVkbbpAS/REc74nDuGrDHa6i7ahYpw22IBdF4xMpcVdFeYtSj4tjY86cedp2e1QKWftSZ525tAj7pMSsCI4rxPF+xvlmnUr+vLONjb2guVHoF6Ftsaq4J6PW6nRnl6PAM8BlwEQ1+9wHHNOct2ONuc/lgBUVI9bP4rjN9a9T3w/AhQXyParRbO7zRGA88LGI7ITYrH/8JVn79k9zPjGslfBGXCej9wNLUsbYygypAK0Mu0z4Vy+f2oRcr4z40RmBHDvRdvLY73zjp9TYSvWvIhJviMjO6GWxRjL2N6sQ7W3CkPnqt2jWksRoLzi9xPyzFUZHtJU8/haXlfceS2SMvePajF2RSDb6LmuHyDY1qGJt+32ouXbeT2Mgx5AiBEPMV6JhjvmPCC1j5+FSVw2clTH+qcYtxJbFAsnYtmwJQigtuoiYpzm7csaD41qeKItVFWQKcbCEIT0NwvVsRcBjJQ9sF2knmMz5tAhHnJ/YVVEac9yFhSW7PPS5C4meBkbszQnXlTE3VRcdB9YC09TWqi+MH9XpMO8c/6Zz4JXygy61BdpOwSf7JRMNi/nfi/Rl4EVlWnv+Uy1Rn429ruevgUsKjHm6wYW4tadaYcTlCqFD7rja5Zb9sHvhYfUZznDhelBHZuPKQqL2mULzgD6H/sqwcuJm3fWmv51lbt6KjHFfWC7LGP8IuDVVyWYpPD7GkKmqVn9JfcvmmMudX1ytzBtWybchjV3l/OUBOWpIhNYONDDkSfV93owBHaqhDjnSXTpHTMwgP+iU6tOV0U4XiQZcmDaZACtt7hZ30sCQcPF9e1kjJrvDU/CBhQVlymY3d6Oc8Cu1ceoL45slk4UrW7ki9m1vl8Dv8ouOEjXPdrVJkgmKLM0YL4Mk1keec4nLfseogq3uhe9W5EgyFO4ua8gFKrGPR9xUzBRHeOFIQQIsQpJS+Ex352whvBBhD1ryqoo7M6KWOXOsIcv1POzyUi5Cjmj0w2YRXskwZP3JXpFDJUqD/7tF+0hnGxiROH3Cc3ezhrQbdkjh3TKgu5mt1U6Ypn9ESK+YVc5FR+q2hK1CWJmwEn6rncB/rxf67tB6IXoAAAAASUVORK5CYII='},
//         {name:'communication',
//         title:'의사소통',
//         grade:null,
//         url:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABZklEQVR4nO2ZsS5EQRSGP9sQT8AqVFqh8Q52eQl6pZUoxIbXUIpeJAii9AxKolHJLkJEjtzk30SuuburWWfkfMk058zc/Cf/3JnkDARB8FtWgEvgGTBnoyttzUFF7DkQa0OOdj8nignvwCZQxx91oCWNhdZGatKVksVE77Sk9SKV7Co5jX+mpLWTSvb2Xi5Yld4o5I+wcMQZFo44w8IRZ1g44gwLR5xh4YgzLBxxhoUjzrBwxBkWjjjD/r0jHSU8tkrLzEjr04+Muty5tEy3+rVMm9+a2K1MmtjLVRPbQ7TzTyvW1oDrET4r7A6quiHLev9Makwk1q2OQHxH2iqdGJY7fXC2FB8DbpQrCnLPrcTOl+LrihfFuKcGvCSO6AW9N74Bi2TAkop4KMUeFd8gEzfOJXgfmAS25UIR2yEDxoEDCf4ADnWjmrbaGplwljgGP4EjYI6MOAZegXvgRDdr+fgNggDffAGLGjyJ7b32awAAAABJRU5ErkJggg=='},
//         {name:'locaiton',
//         title:'위치',
//         grade:null,
//         url:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACXklEQVR4nO2ZMUtcQRSFP5S10IigC4JYKdFOBLGwjEZsDJKEgIFE7CP4C0QCokkjQiqDNilShAQEJUUaSWNhkc4liCBYJGAligZU3PDgLAzD7NvnZsH3wv1gYHffzHDPnTvL7rlgGIZhZJRW4AMwB3STAdqAR8Ab4C1Qr8+fAEWNG2AHeAXkSQm9wDSwBhQUZNEZ9zXvmd6fA9fO80tgC3gONNYopk5gElgGJuImjgAbwLEXdCnbe8B7nQyekG2gHZgFdr21Zyq/MeckK1EP9AMzwEfgyNtzP25xwZl4AXwHFoFx3YUQrhCXHuA1cOAF8BtYAQa9+c3AKDAPfANOA8m8koDo9WGckENNegHkEuWtvBCXIeBd4KR/qnR/eGVZ1DgBvuqL5AHQpAQkFuJn61+FuOXyUGV2Fgj8F/BJ5TkA1AX2SIUQl3vAS2BBe3QkXJc6IdUymEYhedV+5oV80drhrAvZ1tpoj6SYkErYiWClhV32OOyOYHcEuyNx2B3B7gh2R+IYVoY+k/Ffv+jPUf5/EFItqRHSoSAWZCREhkImhHQBU8CqXEffzvkDbCqwXFqENKn252SSnQQCv5a5tiazzX12LFNuqIZCcjIPEwvZlz3pB34qO3Ne9mZzIFsrskXddQeyT3tuKaRVdu2i7NsLZ8/I3i1LyVctjSMZyDMylG9jQI+VcRR35SS2lxHyVEb5XqADUDrpjUrOy4Qs+0lZ+LWgUa2FLbUa3LI894T0BToABZXutFodqSCvJtCOl+3Het6gJtKSWhdRcyn1dOuLZB1ouetgDMMwDKrhL0LefLj+Ut+uAAAAAElFTkSuQmCC'},
//         {name:'satisfaction',
//         title:'만족도',
//         grade:null,
//         url:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAChUlEQVR4nO2ZTYhOURjHf0MThqF3ehuNogwLRA0Ln6kxaykLspiVBQsKS8LOQiiKwmIUC6uxoCzMjJSFpKZMYaYxChn5DEO+BtOp/1untzv3feuee95zdX91Nvec/s/z3HvPOc95DuTk5NSCGcBp4D0wCpwHCmSMqcAt4F9ZGwaayBDH5PgroA1YCjzUs5NkhA7gD/AbWGs936BARsgARX0F4/Chsr5Zev6dwKkDbsjZPmBKWX+b+oYInH1y9C0wL6L/lPrPEjArgR/AX2BzRH8D8EGBrCJQZgJP5KTZN6LYpf67BMwlOTkATJ9kTGnp3U6gbJODX4Elk4xpt/aUegKkFfgsJ3fGjOvWmMMESD1wXw5ejRm3EBjX3tFMgBxXEM8rJIJnNO4iAdJupSDrYsbN1q9nluRlBEYz8Fpv+WCVG2RUM4vDx5g2CtxTmmNSG+cpyE050huRgpTTCfyKCaba9hiY6zKQPVYK0pJwAy1UaPOBLcAj2bziKghzGPok0a34Y7FsmrnmhAMS7MEvBWtOOaFHgmYn98kK2R10JfhGglHpeZpstL7IbheC4xI0RQWfTAPOWfYTJ52lpbBW7JX9B1kPpMnVpK91IGtk/2WWAykC/bJvktDMBjIg289clFxrGch12f5ZIdsOPpA64ITs3876ZC/+L6vWctl/kVToi4Qa8c8Ca8J3JRUblJCp3/qkE/hmrVqJc70LEjuCX7pkt99VFabDOh2aooIvVsuuKck6o0+i3VWc113RkMadyiJdbBrha8Ac/JVkn7oWXm8F8w44qmsC1yWbFh2kSiXZ/aRU8+11UOaptl1O+1fepLtzU3cac+z8GHAH2JFmADk5OWSTCQIHBIvH/7mJAAAAAElFTkSuQmCC'}        
//     ]
// })

// acc_structure.save().then(console.log('structure set'))





