(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{167:function(t,e,a){},193:function(t,e,a){"use strict";var o=a(167);a.n(o).a},224:function(t,e,a){"use strict";a.r(e);var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"login"}},[a("top-bar",{attrs:{title:"用户登录","show-back":""}}),t._v(" "),a("form",[a("section",[a("input",{directives:[{name:"model",rawName:"v-model",value:t.form.username,expression:"form.username"}],attrs:{type:"text",placeholder:"用户名"},domProps:{value:t.form.username},on:{input:function(e){e.target.composing||t.$set(t.form,"username",e.target.value)}}})]),t._v(" "),a("section",[a("input",{directives:[{name:"model",rawName:"v-model",value:t.form.password,expression:"form.password"}],attrs:{type:"password",placeholder:"密码"},domProps:{value:t.form.password},on:{input:function(e){e.target.composing||t.$set(t.form,"password",e.target.value)}}})]),t._v(" "),a("section",[a("input",{directives:[{name:"model",rawName:"v-model",value:t.form.captcha_code,expression:"form.captcha_code"}],attrs:{type:"text",placeholder:"验证码"},domProps:{value:t.form.captcha_code},on:{input:function(e){e.target.composing||t.$set(t.form,"captcha_code",e.target.value)}}}),t._v(" "),a("img",{attrs:{src:t.captcha,alt:""},on:{tap:t.changeCaptcha}})])]),t._v(" "),a("button",{attrs:{type:"button"},on:{tap:t.submit}},[t._v("登录")])],1)};o._withStripped=!0;a(155);var r=a(55),n=a(1),s={name:"Login",components:{TopBar:r.a},data:function(){return{form:{username:"",password:"",captcha_code:""},captcha:"",fromShop:!1}},beforeRouteEnter:function(t,e,a){"/shop"===e.path?a((function(t){t.fromShop=!0})):a()},activated:function(){var t=this;Object(n.e)().then((function(e){var a=e.data;t.captcha=a.code}))},deactivated:function(){this.form={username:"",password:"",captcha_code:""},this.captcha="",this.fromShop=!1},methods:{submit:function(){var t=this;this.form.username?this.form.password?this.form.captcha_code?Object(n.u)(this.form.username,this.form.password,this.form.captcha_code).then((function(e){var a=e.data;0===a.status?(t.$alert({type:"warning",content:a.message}),Object(n.e)().then((function(e){var a=e.data;t.captcha=a.code}))):(t.$alert({type:"success",content:"登录成功"}),t.$store.commit("setUserInfo",a),t.fromShop?t.$router.replace("/confirmOrder?geohash="+t.$route.query.geohash+"&id="+t.$route.query.id):t.$router.go(-1))})):this.$alert({type:"warning",content:"请输入验证码"}):this.$alert({type:"warning",content:"请输入密码"}):this.$alert({type:"warning",content:"请输入用户名"})},changeCaptcha:function(){var t=this;Object(n.e)().then((function(e){var a=e.data;t.captcha=a.code}))}}},c=(a(193),a(7)),i=Object(c.a)(s,o,[],!1,null,null,null);i.options.__file="src/views/Login.vue";e.default=i.exports}}]);