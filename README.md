@[TOC](vue-li-validate)

# 安装：

```
npm install --save vvue-li-validate
```

# 全局配置

```js
import LiValidate from 'vue-li-validate'

const app = createApp(App)

app.use(LiValidate, {
  errorClass: 'li-invalid', // 文本框样式名
  popoverClass: 'li-popover', // 提示样式名
  validateMode: 'single', // 每次校验一条
  tipDuration: 3000, // 校验后不点击文档的话，3秒后自动消失
  position: "bottomLeft",// 错误提示弹出的位置
  scrollMargin: "20px", // 滚动间距 （与浏览器视口或 overflow: auto 的父容器保持固定间距）
  rules: {  // 自定义规则
    phone: {
      pattern: /^1[2-9]\d{9}$/,
      message: '请输入正确的手机号码'
    },
    password: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      message: '请输入密码'
    },
    customRule: {
      pattern: /^your-custom-regex$/,
      message: '请输入自定义规则'
    }
  }
})

```

# 基础用法

1.需要校验的表单必须添加li-form属性，值为表单的ref值，如：li-form="form1",调用校验方法时，传入li-form的值即可，例如：window.liValidate("form1")
2.校验必填项时，必须给input添加li-required="true"属性例如：<input li-required="true"/> 
3.设置了li-message，校验提示会使用li-message里面的内容，否则提示系统默认文案，例如：<input li-message="手机号码为必填项哦"/>
```js
<div li-form="form1">
	姓名：<input v-model="form1.username" placeholder="非必填" />
	*爱好：<input v-model="form1.like" li-required="true" placeholder="必填" />
	*手机：<input v-model="form1.phone" li-required="true" li-message="手机号码为必填项哦" placeholder="必填" />
	<button @click="submitForm1">提交</button>
</div>

const submitForm1 = () => {
  if (window.liValidate("form1")) {
    alert("表单验证通过，准备提交！");
  }
};

```

![在这里插入图片描述](//images.weserv.nl/?url=https://i-blog.csdnimg.cn/direct/d8a14ff2120649b18aa0eacff5f080a0.png)
# 进阶用法

1.传了li-rule的话会校验该规则，提示配套的错误提示，可以同时设置多个校验项目，以逗号隔开；例如：<input li-rule="english,length"/>
2.传了li-reg的话会校验该正则，可以同时设置多个正则，以逗号隔开；例如：<input li-reg="/^\d+$/,/^.{6}$/" li-message="请输入数字,请输入6位字符"/>
3.配置li-reg的话必须配置li-message，否则没有任何提示；
4.假设li-reg或者li-rule配置了多个，那么提示信息会以逗号隔开，例如：<input li-rule="english,length" li-message="请输入英文,请输入6-16位字符"/>

```html
<div li-form="form1">
	*手机号：<input v-model="form2.phone" li-required="true" li-rule="phone" />
	*密码：<input v-model="form2.password" li-required="true" li-rule="english,length" />
	年龄：<input v-model="form2.age" li-reg="/^\d+$/" li-message="请输入数字"/>
	6个数字： <input v-model="form2.hobby" li-message="请输入数字,请输入6位字符" li-reg="/^\d+$/,/^.{6}$/" />
	*性别 <input li-required="true" :value="form2.sex ? 1 : ''" li-message="请选择性别" class="hiddenClass" />
	      <input type="radio" name="sex" v-model="form2.sex" :value="1"/>男
	      <input type="radio" name="sex" v-model="form1.sex" :value="2" />女
	<button @click="submitForm2">提交</button>
</div>

<script>
if (window.liValidate("form2")) {
    alert("表单验证通过，准备提交！");
}
</script>

<style>
.hiddenClass {
  height: 1px;
  width: 1px;
  opacity: 0;
}
</style>
```

![在这里插入图片描述](//images.weserv.nl/?url=https://i-blog.csdnimg.cn/direct/76026337a31e4229b0ecdfa532855b67.png)

# 进阶用法,配置


1.liValidate方法第二个参数配置参数同全局配置参数一致： 有如下参数： errorClass: "config-invalid", 需要校验的dom class
2.popoverClass: "config-popover" 错误提示的class
3.validateMode: "all" 校验模式，single：单个校验，all:全部校验
4.tipDuration: 10000  不点击网页的话，提示持续时间
5.position: "right"   校验提示位置
6.rules: {}   自定义正则 li-rule里面需要用到的
 rules格式 同 constants.ts中的 DEFAULT_RULES保持一致，若liValidate和app.use以及DEFAULT_RULES中都有，则优先级为：liValidate> app.use > constants.ts中的 DEFAULT_RULES


```js
<div li-form="form3">
 *姓名：</span><input v-model="form3.username" li-required="true" /></div>
 *密码：</span><input v-model="form3.password" li-required="true" /></div>
 ...
<button @click="submitForm3">提交</button>
</div>


const submitForm3 = () => {
  if (
    window.liValidate("form3", {
      errorClass: "config-invalid",
      popoverClass: "config-popover",
      validateMode: "all",
      tipDuration: 10000,
      position: "right",
      rules: {
        phone: {
          pattern: /^1[1-9]\d{9}$/,
          message: "请输入正确的手机号码",
        },
        notspaces: {
          pattern: /[^\S]+/g,
          message: "不能输入空格",
        },
      },
    })
  ) {
    alert("表单验证通过，准备提交！");
  }
};
```
![在这里插入图片描述](//images.weserv.nl/?url=https://i-blog.csdnimg.cn/direct/39eb242c26ec4647ab30b0c09d66735e.gif)

# overflow下

```html
<div class="dialog">
   <div li-form="form4" class="form-container">
     <div class="form-group"><span>*姓名：</span><input v-model="form4.username" li-required="true" /></div>
     <div class="form-group"><span>*密码：</span><input v-model="form4.password" li-required="true" /></div>
     <div class="form-group"><span>*性别：</span><input v-model="form4.sex" li-required="true" /></div>
     <div class="form-group"><span>*爱好：</span><input v-model="form4.like" li-required="true" /></div>
     <div class="form-group"><span>*年龄：</span><input v-model="form4.age" li-required="true" /></div>
     <div class="form-group"><span>*电话：</span><input v-model="form4.phone" li-required="true" /></div>
     <div class="form-group"><span>*其他：</span><input v-model="form4.hobby" li-required="true" /></div>
   </div>
 </div>
 <div class="button-group">
   <button @click="submitForm4" class="submit-btn">提交</button>
 </div>


const submitForm4 = () => {
  if (window.liValidate("form4")) {
    alert("表单验证通过，准备提交！");
  }
};

.dialog {
  background: gray;
  height: 300px;
  overflow: auto;
}
```
![在这里插入图片描述](//images.weserv.nl/?url=https://i-blog.csdnimg.cn/direct/13819cb19bd64d74a11c2fc2bff1d87a.gif)

# 自定义弹出位置

```js
 <button id="mouge" >我想飞一会</button>
 <button @click="showMsg">将提示展示到“我想飞一会”标签上</button>
 
import { showCustomPopover }  from "vue-li-validate/utils/popover"; 

const showMsg = () => {
  showCustomPopover(
    document.querySelector("#mouge"),
    "我一下子就飞过来了",
    null,
    30000, // 30秒后自动消失
    "topRight"// 位置
  );
};
```

![在这里插入图片描述](//images.weserv.nl/?url=https://i-blog.csdnimg.cn/direct/dae002526fa04d6fba506a2b9ebc726f.gif)

# 所有可配置项
## 属性 LiValidateOptions
| name | 描述 | 默认值 |
|-|-|---|
| errorClass|需要校验的dom class| ‘li-invalid’|
| popoverClass| 错误提示的class | li-popover |
| validateMode| 校验模式： single：单个校验，all:全部校验 | single  |
| tipDuration| 不点击网页的话，提示持续时间 |  3000 |
| position| 校验提示位置 ：LiValidateOptions.position ('topLeft' ,'topRight', 'bottomLeft' , 'bottomRight' , 'left' , 'right' )| bottomLeft |
| scrollMargin| 滚动间距 （与浏览器视口或 overflow: auto 的父容器保持固定间距）,支持独立配置scrollMarginTop,scrollMarginRight,scrollMarginBottom,scrollMarginLeft| 20px|
| rules| LiValidateOptions.rules |  {}  |

## 方法
| name | 描述 | 参数类型  |
|-|---|--|
| liValidate(formId: string, validateOptions?: LiValidateOptions): boolean |  触发校验事件，通常用于表单提交前  | string，LiValidateOptions  |


## rules
li-rule中配置项有如下配置，如果不够用，可以自己在 LiValidateOptions.rules中配置
```js
export const DEFAULT_RULES = {
  number: {
    pattern: /^[0-9]+$/,
    message: '请输入数字'
  },
  integer: {
    pattern: /^-?[0-9]\d*$/,
    message: '请输入整数'
  },
  decimal: {
    pattern: /^-?[0-9]\d*\.\d+$/,
    message: '请输入小数'
  },
  email: {
    pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
    message: '请输入有效的邮箱地址'
  },
  phone: {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入正确的手机号码'
  },
  url: {
    pattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
    message: '请输入有效的网址'
  },
  idcard: {
    pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    message: '请输入有效的身份证号码'
  },
  chinese: {
    pattern: /^[\u4e00-\u9fa5]+$/,
    message: '请输入中文字符'
  },
  english: {
    pattern: /^[a-zA-Z]+$/,
    message: '请输入英文字符'
  },
  zipcode: {
    pattern: /^\d{6}$/,
    message: '请输入6位邮政编码'
  },
  length: {
    pattern: /^.{6,8}$/,
    message: '请输入6-16位字符'
  }
};

```