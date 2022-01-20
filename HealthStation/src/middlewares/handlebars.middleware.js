const path = require('path');
const handlebars = require('express-handlebars');
const expressHbs = require('express-handlebars');
const hbs = expressHbs.create({});

// hbs.handlebars.registerPartial('packetPartial', function (imgSrc, name, description) {
//     return `<div class="product-item bg-light">
//     <div class="card">
//         <div class="thumb-content">
//             <!-- <div class="price">$200</div> -->
//             <a href="single.html">
//                 <img class="card-img-top img-fluid" src="${imgSrc}" alt="Card image cap">
//             </a>
//         </div>
//         <div class="card-body">
//             <h4 class="card-title"><a href="single.html">${name}</a></h4>
//             <ul class="list-inline product-meta">
//                 <li class="list-inline-item">
//                     <a href="single.html"><i class="fa fa-folder-open-o"></i>Furnitures</a>
//                 </li>
//                 <li class="list-inline-item">
//                     <a href="#"><i class="fa fa-calendar"></i>26th December</a>
//                 </li>
//             </ul>
//             <p class="card-text">${description}</p>
//         </div>
//     </div>
// </div>`
// })

const helper = {
    json: obj => {
        const keys = Object.keys(obj)
        let a = "{";
        keys.forEach(key => a += "'" + key + "':'" + obj[key] + "',");
        a = a.slice(0, -1) + "}";
        return a;
    },
    section: function (name, options) {
        if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
    },
    select: function(selected, options) {
        return options.fn(this).replace(
            new RegExp('value=\"' + selected + '\"'),
            '$& selected="selected"');
    },
    get: function(Obj, prop) {
        return Obj[prop]
    },
    ifCond: function (v1, operator, v2, options) {
        switch (operator) {
          case "==":
            return v1 == v2 ? options.fn(this) : options.inverse(this);
          case "===":
            return v1 === v2 ? options.fn(this) : options.inverse(this);
          case "!=":
            return v1 != v2 ? options.fn(this) : options.inverse(this);
          case "!==":
            return v1 !== v2 ? options.fn(this) : options.inverse(this);
          case "<":
            return v1 < v2 ? options.fn(this) : options.inverse(this);
          case "<=":
            return v1 <= v2 ? options.fn(this) : options.inverse(this);
          case ">":
            return v1 > v2 ? options.fn(this) : options.inverse(this);
          case ">=":
            return v1 >= v2 ? options.fn(this) : options.inverse(this);
          case "&&":
            return v1 && v2 ? options.fn(this) : options.inverse(this);
          case "||":
            return v1 || v2 ? options.fn(this) : options.inverse(this);
          default:
            return options.inverse(this);
        }
    },
}

module.exports = (app) => {
    app.engine('.hbs', handlebars.engine({
        extname: '.hbs',
        helpers: helper,
    }));
    app.set('view engine', '.hbs');
    app.set('views', path.join(__dirname, '../views'));
}