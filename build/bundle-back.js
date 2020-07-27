!function(e){var t={};function o(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=4)}([function(e,t){e.exports=require("path")},function(e,t){e.exports=require("express")},function(e,t){e.exports=require("dotenv")},function(e,t){e.exports=require("mongoose")},function(e,t,o){e.exports=o(5)},function(e,t,o){const n=o(0),r=o(1),i=o(6);o(2).config();const a=o(7);o(12);const u=r();u.set("views",n.join("views")),u.set("view engine","ejs"),u.use(r.json()),u.use(r.urlencoded({extended:!1})),u.use(r.static(n.join("public"))),u.get("/",(e,t)=>{t.render("home",{pageTitle:"Bookshelf",path:e.path})}),u.use(a),u.get("*",(e,t)=>{t.render("404",{pageTitle:"404"})});const l=process.env.PORT||"3000";u.listen(l,()=>{console.log(i.blue("=====================")),console.log(i.bold("http://localhost:"+i.bold.red(l))),console.log(i.blue("====================="))})},function(e,t){e.exports=require("chalk")},function(e,t,o){const n=o(1).Router(),r=o(0),i=(o(8),o(9)),a=o(10),u=o(11);var l=i.diskStorage({destination:function(e,t,o){t.originalname.match(/\.(jpg|jpeg|png|webp)$/i)?o(null,r.join("public","uploads","img")):t.originalname.match(/\.pdf$/i)&&o(null,r.join("public","uploads","pdf"))},filename:function(e,t,o){o(null,`${Date.now()}-${t.originalname}`)}});const s=i({storage:l,limits:1e5,fileFilter(e,t,o){t.originalname.match(/\.(jpg|jpeg|png|webp|pdf)$/i)||o(new Error("File type not allowed.")),o(null,!0)}});n.get("/books",async(e,t)=>{try{let o=u.find();e.query.title&&(o=o.where("title").regex(new RegExp(e.query.title,"i"))),e.query.author&&(o=o.where("author").regex(new RegExp(e.query.author,"i"))),e.query.publishAfter&&(o=o.where("publishDate").gte(e.query.publishAfter)),e.query.publishBefore&&(o=o.where("publishDate").lte(e.query.publishBefore)),e.query.language&&(o=o.where("language").equals(e.query.language));const n=await o.exec();t.render("books/index",{pageTitle:"Books",path:e.path,searchOptions:e.query,books:n})}catch(e){t.render("error",{backButton:"/books",error:e})}});const c=s.fields([{name:"coverImagePath",maxCount:3},{name:"pdfFile",maxCount:3}]);n.post("/books",c,async(e,t)=>{try{const{path:o,originalname:n}=e.files.coverImagePath[0],r=n.split(" ").join("-"),i=`/uploads/img/resized/${Date.now()}-${r}`,{filename:l}=e.files.pdfFile[0],s="/uploads/pdf/"+l;await a(o).resize(250,400).toFile("./public"+i);const c=new u({title:e.body.title,author:e.body.author,description:e.body.description,coverImagePath:i,pdfPath:s,pageNo:e.body.pageNo,language:e.body.language});await c.save(),console.log(c),t.redirect("/books")}catch(e){console.log(e),t.redirect("/books")}}),n.get("/books/new",(e,t)=>{t.render("books/new",{pageTitle:"Add Books",path:e.path})}),e.exports=n},function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("multer")},function(e,t){e.exports=require("sharp")},function(e,t,o){const n=o(3),r=n.Schema({title:{type:String,trim:!0},author:{type:String},description:{type:String,trim:!0},coverImagePath:{type:String},pdfPath:{type:String},pageNo:{type:Number},language:{type:String},publishDate:{type:Date,default:new Date}});e.exports=n.model("Book",r)},function(e,t,o){const n=o(3);o(2).config();(async()=>{try{await n.connect(process.env.MONGO_URI,{useNewUrlParser:!0,useUnifiedTopology:!0}),console.log("database connected!!")}catch(e){console.log(e)}})()}]);