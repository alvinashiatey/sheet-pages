import colors from './colors.js';
class Style {
	constructor() {
		this.color = colors.randomColor;
		this.defaultCSS = `body{font-family:'Helvetica', sans-serif;font-size:62.5%;line-height:1.42857143;color:${this.color};background-color:#fefefe;font-size:1.5rem}.container{width:90%;margin:0 auto}*:where(:not(iframe,canvas,img,svg,video):not(svg *,symbol *)){all:unset;display:revert}*,*::after,*::before{box-sizing:border-box}a{cursor:revert}menu,ol,ul{list-style:none}img{max-width:100%}table{border-collapse:collapse}textarea{white-space:revert}:where([hidden]){display:none}:where([contenteditable]){-moz-user-modify:read-write;-webkit-user-modify:read-write;overflow-wrap:break-word;-webkit-line-break:after-white-space}:where([draggable='true']){-webkit-user-drag:element}header{display:flex;justify-content:space-between;align-items:center;font-size:3rem}.row{border-top:2px solid ${this.color}}.row__image{background:${this.color};width:100%;display:inline-block}.row__image:hover{background:#fefefe}.row__image img{width:100%;height:100%;mix-blend-mode:screen;filter: grayscale(100%) contrast(200%);opacity:1}.row,.row__el{display:flex;margin-block:1.5rem;gap:3rem;justify-content:space-between}.row a,.row img{transition:all 0.5s ease-in-out}.row__image img:hover{filter: none;mix-blend-mode:normal}.block__container{width:100%;height:100%;padding-block:5rem} /* media queries */ @media screen and (max-width: 40em) {.row,.row__el {flex-direction: column;gap: 1rem;}}`;
	}
	get css() {
		return this.defaultCSS;
	}
}

export default new Style();
