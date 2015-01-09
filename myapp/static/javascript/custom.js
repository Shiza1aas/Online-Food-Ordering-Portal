$(document).ready(function(){
// disableing  body

var res={
	loader:$('<div />',{class:'loader-load'}),
	container:$('#lload')
}
// email verifycation 
	function checking_e(data) 
	{
		var pattern=/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
		if(pattern.test(data))
			return true;
		else
			return false;
	}
//checking instant search
$('#bt').keydown(function(){
		var txt=$('#bt').val().trim();
		if(txt.length>0)
		{
			var dic={'s':txt};
		$.ajax({
				type:'post',
	     		contentType: 'application/json',
	     		url:"/instant/",
	     		dataType:'json',
	     		data:JSON.stringify(dic),
	     		success:function(data)
	     		{
			     		//$.getJSON( function( data ) {
			     		$('.results').html("");
			     			var items=[];
			     			items.push( "<p class='pull-right'><em>you type..</em></p><li class='sel'>&nbsp;&nbsp;&nbsp;&nbsp;" + txt + "</li>" );
						  $.each( data, function( key, val ) {
						  	items.push( "<li ><span class='sel'>" + "<span class='glyphicon glyphicon-map-marker'>"+val+"</span></span></li>" );
						  });
						  if(items.length>1)
						 	$('.results').html(items);
						  else
						  	$('.results').html('<b>No result found<b>');
						  $('.sel').mouseover(function(){
						  	var sell=$(this).text();
						  	$("#bt").val(sell);

						  });
						 /* $('#bt').keydown(function(e){
						  	if(e.keyCode==40)
						  	{
						  		alert($('results li:first').next().text());
						  	}
						   
						  });*/
						
	     		}
		});
		}
		else
			$('.results').html("");
	});
// login checking 
		function logchecking(){
			var ps=$("#logp");
			var em=$("#logm");
			var pss=$("#slogp");
			var ems=$("#slogm");
			if(!$("input[name=log4]").is(":checked"))
       			{
       				$('#note').addClass('dangerclass');
       				noteing('Please Choose Log In as..',500,1000);
       				//alert($(location).attr('href'));
       				return false;
       			}
			//alert($("input[name=log4]:checked").val());
			if(pass_ck(ps,pss)&email_ck(em,ems))
			{
				var where=$(location).attr('href');
				var d={'e':em.val().trim(),'p':ps.val().trim(),'l':$("input[name=log4]:checked").val()};
				$.ajax({
					type:'post',
					contentType:'application/json',
					url:'/login_cking/',
					dataType:'json',
					data:JSON.stringify(d),
					beforeSend:function(){
						$('#logb').html('Signing In .....');
						$('#logb').attr('disabled','disabled');
					},
					success:function(data){
						$('#logb').html('Sign In');
						$('#logb').removeAttr('disabled');
						if(data.s=='1')
							{
								ps.removeClass('bordercol');
								$('#slogb').html('');
								$('#note').addClass('successclass');
								noteing('Successfully login....',100,5000);
								window.location.href=where;
							}
						else if(data.s=="0")
							{
								ps.val('');
								ps.addClass('bordercol');
								//$('#slogb').css('color','red').html('email or password is wrong');
								$('#note').addClass('dangerclass');
								noteing('Oops!! Email or Password is wrong',500,1000);
							}
						else
							{
								ps.val('');
								ps.addClass('bordercol');
								//$('#slogb').css('color','red').html('email or password is wrong');
								$('#note').addClass('dangerclass');
								noteing('Oops!! Email or Password is wrong',500,1000);
							}
					}


				});
			}

		}
		function locality_ck(cs,scs)
		{
			if(cs.val().trim().length<3)
			{
				cs.addClass('bordercol');
				scs.css('color','red').html('looking not good');
				return false;
			}
			else
			{
				cs.removeClass('bordercol');
				scs.css('color','red').html('');
				return true;
			}
		}
		function img_ck(o,so)
		{
			if(o.val()!='')
			{
				o.removeClass('bordercol');
				return true;
			}
			else
			{
				o.addClass('bordercol');
				return false;
			}
		}
		function phone_ck(ph,sph)
		{
			var phone=ph.val().trim();
			if(phone.length<10||phone.length>10)
			{
				ph.addClass('bordercol');
				sph.css('color','red').html('Invalid !!');
				return false;	
			}
			else if(isNaN(phone)||(phone.charAt(0)!='9'&&phone.charAt(0)!='8'&&phone.charAt(0)!='7'))
			{
				ph.addClass('bordercol');
				sph.css('color','red').html('Invalid !!');
				return false;
			}
			else
			{
				ph.removeClass('bordercol');
				sph.css('color','red').html('');
				return true;	
			}
		}
		function area_ck(cs,scs)
		{
			if(cs.val().trim().length<3)
			{
				cs.addClass('bordercol');
				scs.css('color','red').html('looking not good');
				return false;
			}
			else
			{
				cs.removeClass('bordercol');
				scs.css('color','red').html('');
				return true;
			}
		}
		function city_ck(cs,scs)
		{
			if(cs.val().trim().length<3)
			{
				cs.addClass('bordercol');
				scs.css('color','red').html('looking not good');
				return false;
			}
			else
			{
				cs.removeClass('bordercol');
				scs.css('color','red').html('');
				return true;
			}
		}
		function pass_ck(ps,pss)
		{
			
			if(ps.val().trim().length<6)
			{
				ps.addClass('bordercol');
				pss.css('color','red').html('Atleast 6 characters');
				ps.val('')
				return false;
			}
			else
			{
				ps.removeClass('bordercol');
				pss.css('color','red').html('');
				return true;
			}
		}
		function email_ck(em,ems)
		{
			
			if(checking_e(em.val().trim()))
			{
				em.removeClass('bordercol');
				ems.css('color','red').html('');
				return true;
			}
			else
			{
				em.addClass('bordercol');
				ems.css('color','red').html('Invalid email');
				return false;
			}
		}
		function name(n,ns)
		{
			if(n.val().trim().length<2)
			{
				n.addClass('bordercol');
				ns.css('color','red').html('looking not good ?');
				return false;
			}
			else
			{
				n.removeClass('bordercol');
				ns.css('color','red').html('');
				return true;
			}
		}
		function txt_ck(n,ns)
		{
			if(n.val().trim().length<4||n.val().trim().length>500)
			{
				n.addClass('bordercol');
				ns.css('color','red').html('word limit 10 to 499');
				return false;
			}
			else
			{
				n.removeClass('bordercol');
				ns.css('color','red').html('');
				return true;
			}
		}
		$("#logp").keydown(function (e) {
		    if (e.keyCode == 13) 
		    	logchecking();
		});
		$("#logb").click(logchecking);
		$("#logm").keydown(function (e) {
		    if (e.keyCode == 13) 
		    	logchecking();
		});
//signup checking....
	function signchecking()
	{
			var ps=$("#sigp");
			var em=$("#sigm");
			var pss=$("#ssigp");
			var ems=$("#ssigm");
			var n=$("#sign");
			var ns=$("#ssign");
			if(pass_ck(ps,pss)&email_ck(em,ems)&name(n,ns))
			{
				$("#sigb").attr('disabled','disabled');
				$("#sigb").html('Signing.... ')
				var d={'p':ps.val().trim(),'e':em.val().trim(),'n':n.val().trim()};
				$.ajax({
					type:'post',
					url:'/signup_cking/',
					contentType:'application/json',
					dataType:'json',
					data:JSON.stringify(d),
					success:function(data)
					{
						if(data.s=='1')
						{
							$("#sigb").html('Signing....');
							$("#sigb").removeAttr('disabled');
							$('#note').addClass('successclass');
							noteing('Successfully Signup redirecting to home....',100,5000);
							window.location.href='/';
						}
						else
						{
							$("#sigb").html('Signup');
							$("#sigb").removeAttr('disabled');	
							$("#sigm").addClass("bordercol");
							//$("#ssigm").css('color','red').html('Already in use');
							$('#note').addClass('dangerclass');
							noteing('Email already in use',500,2000);
						}
					}

				});
			}
	}

		function loadwhichpageofprofile(h,cp,up,i)
		{
			
			var ithas;
			if(!$('#info1').hasClass('hide'))
				ithas=$('#info1');
			else if(!$('#hist').hasClass('hide'))
				ithas=$('#hist');
			else if(!$('#uplod').hasClass('hide'))
				ithas=$('#uplod');
			else if(!$('#cngpass').hasClass('hide'))
				ithas=$('#cngpass');
			ithas.addClass('hide');
			if(h==1)
				$('#hist').removeClass('hide');
			else if(cp==1)
				$('#cngpass').removeClass('hide');
			else if(up==1)
				$('#uplod').removeClass('hide');
			else if(i==1)
				$('#info1').removeClass('hide');
			
		}

		// calling loadwhichpageofprofile
		$('#info_load').click(function(){
			//alert('info');
			loadwhichpageofprofile(0,0,0,1);
		});
		$('#cngpass_load').click(function(){
			//alert('pass');
			loadwhichpageofprofile(0,1,0,0); 
			alert('pass');
		});
		
		$('#hist_load').click(function(){
			alert('hist');
			
		});

		$("#sigp").keydown(function (e) {
		    if (e.keyCode == 13) 
		    	signchecking();
		});
		$("#sign").keydown(function (e) {
		    if (e.keyCode == 13) 
		    	signchecking();
		});
		$("#sigb").click(signchecking);
		$("#sigm").keydown(function (e) {
		    if (e.keyCode == 13) 
		    	signchecking();
		    });

		// page loading events...
		/*$("#prod").click(function(){
			$('#loadhere').load('profile');
			history.pushState(null, null, 'profile');
		});
		/*$("#dashlist li").click(function(){
			var s=$(this).text();
			alert(s.replace(/[0-9]+/g,''));
		});*/

	$("#info_e").click(function(){
		$("#info_s").removeClass('hide');
		$("#info_e").addClass('hide');
		$("#info_e_n").removeAttr('disabled');
		$("#info_e_m").removeAttr('disabled');
		$("#info_e_add").removeAttr('disabled');

	});
	$('#info_s').click(function(){

	});

	// Need to change ......

	function focusingoldpass()
	{
		if(!$('#oldcng').is(':disabled'))
		{
			var d={'p':$('#oldcng').val().trim(),'c':'old'};
			$.ajax({
				url:'/login_cking/pass_ing_pass/',
				type:'post',
				contentType:'application/json',
				dataType:'json',
				data:JSON.stringify(d),
				success:function(data){
					if(data.s=='1')
					{
						$('#soldcng_w').addClass('hide');
						$('#soldcng_c').removeClass('hide');
						$('#oldcng').attr('disabled','disabled');
						return true;
					}
					else
					{
						$('#soldcng_c').addClass('hide');
						$('#soldcng_w').removeClass('hide');
						$('#oldcng').focus();
						return false;
					}
				}
			});
		}
		else
			return true;

	}
	$('#newcng').focus(function(){
		if(focusingoldpass())
		{
			$('#newcng').keyup(function(){

				if($('#newcng').val().trim().length>=6)
				{
					$('#snewcng_w').addClass('hide');
					$('#snewcng_c').removeClass('hide');
				}
				else
				{
					$('#snewcng_c').addClass('hide');
					$('#snewcng_w').removeClass('hide');
				}
			});
		}
	});
	$('#confcng').focus(function(){
		if(focusingoldpass())
		{
			//alert('here');
			if($('#newcng').val().trim().length<6)
				$('#newcng').focus();
			$('#confcng').keyup(function(){
				if($('#confcng').val().trim()==$('#newcng').val().trim())
				{
						$('#sconfcng_w').addClass('hide');
						$('#sconfcng_c').removeClass('hide');	
				}
				else
				{
					$('#sconfcng_c').addClass('hide');
					$('#sconfcng_w').removeClass('hide');
				}
			});
		}
		else
		{
			//alert('else');
		}
	});
	$("#chng_pass").click(function(){
		if($('#confcng').val().trim().length>=6)
		{
			var d={'p':$('#confcng').val().trim(),'c':'new'};
			$.ajax({
				url:'/login_cking/pass_ing_pass/',
				type:'post',
				contentType:'application/json',
				dataType:'json',
				data:JSON.stringify(d),
				beforeSend:function(){
					res.container.append(res.loader);
				},
				success:function(data){
					res.container.find(res.loader).remove();
					if(data.s=='1')
					{
						$('#confcng').val('');
						$('#newcng').val('');
						$('#oldcng').val('');
						$('#oldcng').removeAttr('disabled');
						$('#sconfcng_c').addClass('hide');
						$('#sconfcng_w').addClass('hide');
						$('#snewcng_c').addClass('hide');
						$('#snewcng_w').addClass('hide');
						$('#soldcng_c').addClass('hide');
						$('#soldcng_w').addClass('hide');
						//$('#cng_alert').addClass('alt-font');
						//$('#cng_alert').css('background','rgba(0,128,0,0.8)');
						//$('#cng_alert').css('color','white').html('Successfully Change');
						$('#note').addClass('successclass');
						noteing('Successfully Change',100,2500);
					}
					else
					{
						$('#cng_alert').addClass('alt-font');
						//$('#cng_alert').css('background','rgba(255,0,0,0.8)');
						//$('#cng_alert').css('color','white').html('Not Change');
						$('#note').addClass('dangerclass');
						noteing('Not Change',100,2500);
					}
				}
			});
		}	
		else
		{
			$('#note').addClass('dangerclass');
			noteing('All field are compulsory ',100,2000);
		}
	});
$('.de_menu').click(function(){

var v=$(this).val().trim();
upload_menu_item('rm','rm','rm',v,'rm');
$(this).parent().addClass('hide'); 
});
// uploading data
	function upload_menu_item(upm,upp,menu,typ,pric)
	{
		if(menu=='rm')
			var d={'i':parseInt(typ),'w':'rm'};
		else
			var d={'m':menu,'t':typ,'p':pric,'w':'add'};
		$.ajax({
			url:'/upload_menu_item/',
			type:'post',
			dataType:'json',
			contentType:'application/json',	
			data:JSON.stringify(d),
			beforeSend:function(){
				//$('#upld').addClass('loader-load');
			},
			success:function(data)
			{
				//$('#upld').removeClass('loader-load');
				if(data.s=='1')
				{
					//$('#upld_alert').addClass('alt-font');
					//$('#upld_alert').css('background','rgba(0,128,0,0.8)');
					//$('#upld_alert').css('color','white').html('Successfully uploaded!!');
					if(menu=='rm')
					{
					$('#note').addClass('successclass');
					noteing('Removed..',100,1000);
					}
					else
					{
					upm.val('');
					upp.val('');
					$('#note').addClass('successclass');
					noteing('Successfully uploaded!!',100,1000);
					}
				}
				else
				{
						//$('#upld_alert').addClass('alt-font');
						//$('#upld_alert').css('background','rgba(255,0,0,0.8)');
						//$('#upld_alert').css('color','white').html('Not uploaded');
						if(menu=='rm')
						{
						$('#note').addClass('dangerclass');
						noteing('Try Again..',100,1000);
						}
						else
						{
						$('#note').addClass('dangerclass');
						noteing('Not uploaded!!',100,1000);
						return ;
						}
				}
			}
		});
		return ;
	}
	$("#up_submit_m1").click(function(){
		if($('#up_m1').val().trim().length>=3)
		{
			$('#up_m1').removeClass('bordercol');
			if($("input[name=f-type-1]").is(":checked"))
			{
				if($('#up_m1_price').val().trim().length>=1)
				{
					$('#up_m1_price').removeClass('bordercol');			
					upload_menu_item($('#up_m1'),$('#up_m1_price'),$('#up_m1').val().trim(),$("input[name=f-type-1]:checked").val(),$('#up_m1_price').val().trim());
				}
				else
				{
					$('#up_m1_price').addClass('bordercol');
					//alert('Please enter menu price');
					$('#note').addClass('dangerclass');
					noteing('Please enter menu price',100,1000);
				}
			}
			else
			{
				//alert('Please checked Veg or Non-Veg');
				$('#note').addClass('dangerclass');
				noteing('Please checked Veg or Non-Veg',100,1000);
			}
		}
		else
		{
			$('#up_m1').addClass('bordercol');
			//alert('Please input valid menu name');
			$('#note').addClass('dangerclass');
			noteing('Please input valid menu name',100,1000);
		}

	});
	$("#up_submit_m2").click(function(){

		if($('#up_m2').val().trim().length>=3)
		{
			$('#up_m2').removeClass('bordercol');
			if($("input[name=f-type-2]").is(":checked"))
			{
				if($('#up_m2_price').val().trim().length>=1)
				{
					$('#up_m2_price').removeClass('bordercol');
					upload_menu_item($('#up_m2'),$('#up_m2_price'),$('#up_m2').val().trim(),$("input[name=f-type-2]:checked").val(),$('#up_m2_price').val().trim());
				}
				else
				{
					$('#up_m2_price').addClass('bordercol');
					//alert('Please enter menu price');
					$('#note').addClass('dangerclass');
					noteing('Please enter menu price',100,1000);
				}
			}
			else
			{
				$('#note').addClass('dangerclass');
				noteing('Please checked Veg or Non-Veg',100,1000);
			}
		}
		else
		{
			$('#up_m2').addClass('bordercol');
			$('#note').addClass('dangerclass');
			noteing('Please input valid menu name',100,1000);
		}

	});
	$("#up_submit_m3").click(function(){

		if($('#up_m3').val().trim().length>=3)
		{
			$('#up_m3').removeClass('bordercol');
			if($("input[name=f-type-3]").is(":checked"))
			{
				if($('#up_m3_price').val().trim().length>=1)
				{
					$('#up_m3_price').removeClass('bordercol');
					upload_menu_item($('#up_m3'),$('#up_m3_price'),$('#up_m3').val().trim(),$("input[name=f-type-3]:checked").val(),$('#up_m3_price').val().trim());
				}
				else
				{
					$('#up_m3_price').addClass('bordercol');
					$('#note').addClass('dangerclass');
					noteing('Please enter menu price',100,1000);
				}
			}
			else
			{
				$('#note').addClass('dangerclass');
				noteing('Please checked Veg or Non-Veg',100,1000);
			}
		}
		else
		{
			$('#up_m3').addClass('bordercol');
			$('#note').addClass('dangerclass');
			noteing('Please input valid menu name',100,1000);
		}


	});
	$("#up_submit_m4").click(function(){

		if($('#up_m4').val().trim().length>=3)
		{
			$('#up_m4').removeClass('bordercol');
			if($("input[name=f-type-4]").is(":checked"))
			{
				if($('#up_m4_price').val().trim().length>=1)
				{
					$('#up_m4_price').removeClass('bordercol');
					upload_menu_item($('#up_m4'),$('#up_m4_price'),$('#up_m4').val().trim(),$("input[name=f-type-4]:checked").val(),$('#up_m4_price').val().trim());
				}
				else
				{
					$('#up_m4_price').addClass('bordercol');
					$('#note').addClass('dangerclass');
					noteing('Please enter menu price',100,1000);
				}
			}
			else
			{
				$('#note').addClass('dangerclass');
				noteing('Please checked Veg or Non-Veg',100,1000);
			}
		}
		else
		{
			$('#up_m4').addClass('bordercol');
			$('#note').addClass('dangerclass');
			noteing('Please input valid menu name',100,1000);
		}


	});
// end of uploading data
		function sign_up_for_o()
		{
			var o_e=$("#o_email");
			var so_e=$("#so_email");
			var o_name=$("#o_name");
			var so_name=$("#so_name");
			var o_loc=$("#o_locality");
			var so_loc=$("#so_locality");
			var o_a=$("#o_area");
			var so_a=$("#so_area");
			var o_c=$("#o_city");
			var so_c=$("#so_city");
			var o_ph=$("#o_phone");
			var so_ph=$("#so_phone");
			var o_img=$("#o_img");
			var so_img=$("#so_img");
			var o_pass=$("#o_pass");
			var so_pass=$("#so_pass");
			$("#o_signup").attr('disabled','disabled');
			$("#o_signup").html('Signing.... ')
			if(area_ck(o_a,so_a)&phone_ck(o_ph,so_ph)&pass_ck(o_pass,so_pass)&email_ck(o_e,so_e)&name(o_name,so_name)&city_ck(o_c,so_c))
			{
				var flag=0;
				var d={'e':o_e.val().trim(),'r_n':o_name.val().trim(),
					'ar':o_a.val().trim(),'cit':o_c.val().trim(),'ph':o_ph.val().trim(),'pa':o_pass.val().trim()};
					$.ajax({
					type:'post',
					url:'/rest_user_cking/',
					contentType:'application/json',
					dataType:'json',
					data:JSON.stringify(d),
					success:function(data)
						{
							if(data.r=='1')
							{
								o_e.removeClass('bordercol');
								so_e.css('color','red').html('');
								$("#o_signup").html('Signup');
								$("#o_signup").removeAttr('disabled');
								window.location.href='/';
							}
							else
							{
								o_e.addClass('bordercol');
								so_e.css('color','red').html('This email Address not allowed');
								$("#o_signup").html('Signup');
								$("#o_signup").removeAttr('disabled');

							}
						}
					});
					
			}
			else
			{
				$("#o_signup").html('Signup');
				$("#o_signup").removeAttr('disabled');
				return false;
			}
		}
	$("#o_signup").click(sign_up_for_o);
	$("#o_email,#o_name,#o_area,#o_city,#o_phone, #o_pass").keydown(function (e) {
		    if (e.keyCode == 13) 
		    	sign_up_for_o();
		});	
	$("#pro_pic_id").change(function(){

		$("#pro_pic_btn").removeAttr('disabled');
	});
// Cart working
$('.add_cart').click(function(){
	var id=$(this).val();
	var q=$('#qun_'+id);
	var d={'i':id,'q':q.val()};
	$.ajax({
		url:'/add_menu_cart/',
		type:'post',
		contentType:'application/json',
		dataType:'json',
		data:JSON.stringify(d),
		beforeSend:function(){
			$('#load_cart_data').addClass('loader-load');
		},
		success:function(data){
			var items=[];
			//items.push( "<p class='pull-right'><em>you type..</em></p><li class='sel'>" + txt + "</li><li class='divider'></li>&nbsp;" );
			$.each( data.products, function( key, val ) {
			items.push( '<center><b>'+val.nam+' ( '+val.q+' x <i class="fa fa-inr"></i>'+val.pri+' )</b></center> <span class="pull-right glyphicon glyphicon-trash trash"id='+val.pid+'></span><hr/>' );
			});
			$('#cart_items_list').html(items);
			$('#total_pay').html('<b>'+data.totals+'</b>');
			$('#cart_badge').html(data.count)
			$('#load_cart_data').removeClass('loader-load');
			if (data.totals>=300)
			{
				$('#checkout').html('<center><b>Proceed to checkout</b></center>');
				$('#checkout').removeAttr('disabled');
			}
			else
			{

			}
			//location.reload();
		}
	});
	});
$('.trash').click(function(){
var d={'i':this.id};
	$.ajax({
		url:'/delete_menu_cart/',
		type:'post',
		contentType:'application/json',
		dataType:'json',
		data:JSON.stringify(d),
		beforeSend:function(){
			$('#load_cart_data').addClass('loader-load');
		},
		success:function(data){
			var items=[];
			//items.push( "<p class='pull-right'><em>you type..</em></p><li class='sel'>" + txt + "</li><li class='divider'></li>&nbsp;" );
			$.each( data.products, function( key, val ) {
			items.push( '<center><b>'+val.nam+' ( '+val.q+' x <i class="fa fa-inr"></i>'+val.pri+' )</b></center> <span class="pull-right glyphicon glyphicon-trash trash"id='+val.pid+'></span><hr/>' );
			});
			$('#cart_items_list').html(items);
			$('#total_pay').html('<b>'+data.totals+'</b>');
			$('#cart_badge').html(data.count)
			$('#load_cart_data').removeClass('loader-load');
			location.reload();
		}
	});

});
//cart end
$('#iamuser').click(function(){
	$('#cont_guest').addClass('hide');
	$('#iamuser_login').removeClass('hide');
	$('#g_o_n_p').removeClass('hide');
});
$('#guest').click(function(){
	$('#cont_guest').removeClass('hide');
	$('#iamuser_login').addClass('hide');
	$('#g_o_n_p').addClass('hide');
});
$('#cont_guest').click(function(){
	var em=$('#g_o_n_e').val().trim();
	if(checking_e(em))
	{
		$('#sg_o_n_e').html('');
		$('#checkform_bill').submit();
	}
	else
	{
		$('#sg_o_n_e').css('color','red').html('Invalid email');
	}
});
$('#iamuser_login').click(function(){
	var em=$('#g_o_n_e').val().trim();
	if(checking_e(em))
	{
		$('#sg_o_n_e').html('');
		if(pass_ck($('#g_o_n_p'),$('#sg_o_n_p')))
		{
			var d={'e':em,'p':$('#g_o_n_p').val().trim()};
			$.ajax({
					type:'post',
					contentType:'application/json',
					url:'/check_login_billing/',
					dataType:'json',
					data:JSON.stringify(d),
					success:function(data){
						if(data.s=='1')
						{
							$('#checkform_bill').submit();
						}
						else
						{
							//alert('Email or password is wrong');
							$('#note').addClass('dangerclass');
							noteing('Email or password is wrong',100,2000);
							$('#g_o_n_p').val('')
						}
					}
			});
		}
	}
	else
	{
		$('#sg_o_n_e').css('color','red').html('Invalid email');
	}
});
// checkout checking.........
$('#del_btnn').click(function(){
	if(area_ck($('#del_add'),$('#sdel_add'))&city_ck($('#del_city'),$('#sdel_city'))&phone_ck($('#del_mob'),$('#sdel_mob'))&name($('#del_nam'),$('#sdel_nam')))
	{
		$('#note').addClass('successclass');
		noteing('Your Order is Placed, we will confirm your order Soon..',100,5000);
		setTimeout(function(){$('#final').submit();},2000);
	}
});
$('#quer_btn').click(function(){ $('#m_s').submit();});

$('.ifdelv').click(function(){
	var roid=(this.id).replace('ifdelv','');
	var d={'roid':roid};
	$.ajax({
		url:'/order_checkout_billing/yes/',
		type:'post',
		contentType:'application/json',
		dataType:'json',
		data:JSON.stringify(d),
		success:function(data){
			if(data.s=='1')
			{
				roid='#ifdelv'+roid;
				$(roid).html('Delivered');
				$(roid).removeClass('ifdelv');
				$(roid).removeClass('sty_cur');
			}
			else
			{
				//alert('Something went wrong Try later !!!');
				$('#note').addClass('dangerclass');
				noteing('Something went wrong Try later !!!',100,2000);
			}
		}
	});


});

$('#up_general').click(function(){

var ad=$('#info_e_add');
var mob=$('#info_e_m');
var ci=$('#info_e_city');
var sad=$('#sinfo_e_add');
var smob=$('#sinfo_e_m');
var sci=$('#sinfo_e_city');
if(area_ck(ad,sad)&city_ck(ci,sci)&phone_ck(mob,smob))
{
	var d={'s':ad.val().trim(),'c':ci.val().trim(),'m':mob.val().trim()};
	$.ajax({
		url:'/profile/general/',
		type:'post',
		contentType:'application/json',
		dataType:'json',
		data:JSON.stringify(d),
		success:function(data){
			if(data.s=='1')
			{
				$('#note').addClass('successclass');
				noteing('Successfully Saved !!',100,2000);
			}
			else
			{
				$('#note').addClass('dangerclass');
				noteing('Something went wrong Try later !!!',100,2000);
			}
		}
	});
}
});
function noteing(data,fi,dly)
	{
		$("#note").html("<div id='note-text'><center>"+data+"</center></div>")
		$('#note').fadeIn(fi).delay(dly).fadeOut(1000);// default fi=500,dly=1000
	}
	
$('#rev_sbt').click(revchecking);
function revchecking()
{
	var txt=$('#rev_text').val().trim();
	if(txt.length<=800&&txt.length>=4)
	{
		revposting('default',txt);	
	}
	else
	{
		$('#rev_text').addClass('bordercol');
		$('#note').addClass('dangerclass');
		noteing('Please write review...',100,1000);
	}
}
	$('.delt_rev').click(function(){
		var data=$(this).val().trim();
		revposting('delt',data);
	});
	$('.cnf_rev').click(function(){
		var data=$(this).val().trim();
		revposting('cnf',data);
	});
function revposting(wht,data)
{
	if(wht=='default')
		var d={'t':data,'w':'default'};
	else if(wht=='cnf')
		var d={'reid':parseInt(data),'w':'cnf'};
	else if(wht=='delt')
		var d={'reid':parseInt(data),'w':'delt'};
	else
		return;
	$.ajax({
		url:'/reviews/',
		type:'post',
		dataType:'json',
		contentType:'application/json',
		data:JSON.stringify(d),
		success:function(data){
			if(data.s=='1')
			{
				$('#note').addClass('successclass');
				noteing('Successfully done !!',100,2000);
			}
			else
			{
				$('#note').addClass('dangerclass');
				noteing('Something went wrong try again !!',100,2000);
			}
			location.reload();
		}
	});

}
$('#con_send').click(function(){
	var n=$('#con_name');
	var ns=$('#scon_name');
	var mob=$('#con_mobile');
	var smob=$('#scon_mobile');
	var txt=$('#con_msg');
	var stxt=$('#scon_msg');
	var e=$('#con_email');
	var se=$('#scon_email');
	if(name(n,ns)&phone_ck(mob,smob)&txt_ck(txt,stxt)&email_ck(e,se))
	{
		var d={'e':e.val().trim(),'n':n.val().trim(),'m':mob.val().trim(),'msg':txt.val().trim(),'w':'addme'};
		n.val('');mob.val('');txt.val('');e.val('');
		sendme(d);
	}
});
$('.sty_cur').click(function(){
var idm=this.id;
var well=idm+'_well';
var cid=idm.replace('sty_cur_','');
var d={'cid':parseInt(cid),'w':'delme'};
sendme(d);
$('#'+idm).removeClass('sty_cur');
$('#'+well).addClass('hide');
});
function sendme(d)
{
	$.ajax({

			url:'/contactus/',
			type:'post',
			contentType:'application/json',
			dataType:'json',
			data:JSON.stringify(d),
			success:function (data){
				if(data.s=='1')
				{
					if(d.w=='addme')
					{
						$('#note').addClass('successclass');
						noteing('Sent to Admin, contact You Soon..',100,2000);
					}
					else
					{
						$('#note').addClass('successclass');
						noteing('deleted',100,2000);
					}
					//setTimeout(function(){location.reload();},2000);
				}
				else
				{
					$('#note').addClass('dangerclass');
					noteing('Something went wrong..',100,2000);
				}

			}
		});
}
$('.clk_rest').click(function(){

	var id_clk=(this.id).replace('restu_','');
	var d={'t':'r','e':id_clk};
	var idm = $(this).parent().attr('id');
	del_adm(d);
	$('#'+idm).addClass('hide');
});
$('.clk_u').click(function(){
	var id_clk=(this.id).replace('u_','');
	var d={'t':'u','e':id_clk};
	var idm = $(this).parent().attr('id');
	del_adm(d);
	$('#'+idm).addClass('hide');
});

function del_adm(d)
{
	//alert(d.e);
	$.ajax({
		url:'/deleteuserrest/',
		type:'post',
		contentType:'application/json',
		dataType:'json',
		data:JSON.stringify(d),
		success:function(data){
			if(data.s=='1')
			{
				$('#note').addClass('successclass');
				noteing('deleted..',100,1000);
			}
			else
			{
				$('#note').addClass('dangerclass');
				noteing('deleted..',100,1000);
			}
		}

	});
}

});