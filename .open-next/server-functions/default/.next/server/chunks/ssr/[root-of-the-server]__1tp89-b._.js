module.exports=[93695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},71029,(a,b,c)=>{"use strict";c._=function(a){return a&&a.__esModule?a:{default:a}}},26758,a=>{a.v("/_next/static/media/favicon.2vob68tjqpejf.ico"+(globalThis.NEXT_CLIENT_ASSET_SUFFIX||""))},38872,a=>{"use strict";let b={src:a.i(26758).default,width:256,height:256};a.s(["default",0,b])},52289,a=>{"use strict";var b=a.i(7997),c=a.i(22734),d=a.i(14747),e=a.i(62434);let f=d.default.join(process.cwd(),"content","posts");var g=a.i(95936),h=a.i(3236);a.s(["default",0,function(){let a=c.default.readdirSync(f).map(a=>{let b=d.default.join(f,a),g=c.default.readFileSync(b,"utf8"),{data:h}=(0,e.default)(g);return{slug:a.replace(".mdx","").trim(),title:h.title||"Sem título",date:h.date||"",category:h.category||"geral",image:h.image||null}});return(0,b.jsxs)("main",{children:[(0,b.jsxs)("section",{className:"hero-blog",children:[(0,b.jsx)("h1",{children:"Blog Tupiniquim"}),(0,b.jsx)("p",{children:"Conteúdos sobre tecnologia e crescimento digital."})]}),(0,b.jsx)("section",{className:"list",children:a.map(a=>(0,b.jsx)(g.default,{href:`/blog/${a.slug}`,style:{textDecoration:"none",color:"inherit"},children:(0,b.jsxs)("div",{className:"post-card",children:[a.image&&(0,b.jsx)(h.default,{src:a.image,alt:a.title,width:120,height:80,className:"thumb"}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h2",{className:"post-title",children:a.title}),(0,b.jsx)("p",{children:a.date})]})]})},a.slug))}),(0,b.jsx)("style",{children:`
        .hero-blog {
          background: linear-gradient(120deg,#111,#1B5E20);
          color: white;
          padding: 40px;
          border-radius: 10px;
          margin-bottom: 30px;
        }

        .list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .post-card {
          display: flex;
          gap: 16px;
          align-items: center;
          padding: 16px;
          border: 1px solid #ddd;
          border-radius: 10px;
          background: #fff;
          transition: 0.2s;
          cursor: pointer;
        }

        .post-card:hover {
          border-color: #2E7D32;
        }

        .post-title {
          margin-bottom: 5px;
          transition: 0.2s;
        }

        .post-card:hover .post-title {
          color: #2E7D32;
        }

        .thumb {
          border-radius: 8px;
          object-fit: cover;
        }
      `})]})},"metadata",0,{title:"Blog | Tupiniquim",description:"Conteúdos sobre tecnologia, negócios e inovação da Tupiniquim."}],52289)},52921,a=>{a.n(a.i(52289))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1tp89-b._.js.map