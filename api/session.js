const {json,secret,makeToken,cookie,COOKIE}=require('./_shared');
module.exports=async function(req,res){
  if(req.method==='DELETE'){res.setHeader('Set-Cookie',cookie('',0));return json(res,200,{ok:true})}
  if(req.method!=='POST')return json(res,405,{error:'Method not allowed'});
  try{secret();const supplied=String(req.body?.passcode||'');const expected=process.env.APP_PASSCODE||'';const a=Buffer.from(supplied),b=Buffer.from(expected);if(!expected||a.length!==b.length||!require('node:crypto').timingSafeEqual(a,b))return json(res,401,{error:'Invalid passcode'});res.setHeader('Set-Cookie',cookie(makeToken(),60*60*24));return json(res,200,{authenticated:true})}catch(e){return json(res,500,{error:'Server configuration error'})}
};
