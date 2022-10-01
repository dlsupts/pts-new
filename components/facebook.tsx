import Script from 'next/script'

export default function Facebook() {
	return (
		<>
			<div id="fb-root" />
			<div id="fc" className="fb-customerchat" />

			<Script
				id="fb-chat"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `var c=document.getElementById('fc');c.setAttribute("page_id", "208440378090");c.setAttribute("attribution", "biz_inbox");
					window.fbAsyncInit=function(){FB.init({xfbml:true,version:'v15.0'})};
					(function(d, s, id) {
					var js, fjs = d.getElementsByTagName(s)[0];
					if (d.getElementById(id)) return;
					js = d.createElement(s); js.id = id;
					js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
					fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));`
				}}
			/>
		</>
	)
}
