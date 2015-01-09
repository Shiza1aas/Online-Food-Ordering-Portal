from werkzeug import check_password_hash
from flask import *
from myapp.db_other import get_db,query_db


cartorder=Blueprint('cartorder',__name__)

@cartorder.route('/ordering_delivery/',methods=['POST'])
def ordering_delivery():
	cus_name=request.form['del_nam_name'].strip()
	cus_add=request.form['del_add_name'].strip()
	cus_city=request.form['del_city_name'].strip()
	cus_mob=request.form['del_mob_name'].strip()
	try:
		r=get_db()
		rr=r.cursor()
		rr.execute('insert into rest_order_history (r_id,addr) values(%s,%s)',[int(session['r_id']),str(cus_add+' , '+cus_city+' , '+'mobile: '+cus_mob)])
		r.commit()
	except:
		pass
	try:
		r=query_db('select max(ro_id) from rest_order_history')
		if r:
			for i in r:
				roid=i[0]
				break
		d=session['cart']
		for i in range(1,session['number']+1):
			if(d.get(str(i))):
				try:
					r=get_db()
					rr=r.cursor()
					rr.execute('insert into store_rest_orders (ro_id,ord) values(%s,%s)',[int(roid),str(d.get(str(i)).get('nam')+' Qty: '+str(d.get(str(i)).get('q')))])
					r.commit()
				except:
					pass
		if 'user' in session and session['type']=='gen':
			el=g.user[0]
		else:
			el=session['ord_eml']
		r=get_db()
		rr=r.cursor()
		rr.execute('insert into user_order_history (email,ro_id) values(%s,%s)',[str(el),int(roid)])
		r.commit()
	except:
		pass
	d={}
	session['cart']=d
	session['total']=0
	session['number']=0
	session['count']=0
	return redirect(url_for('home.home'))
@cartorder.route('/delete_menu_cart/',methods=['POST'])
def delete_menu_cart():
			j=request.get_json()
			d=session['cart']
			total=session['total']
			for i in range(1,session['number']+1):
				if(d.get(str(i))):
					if(d.get(str(i)).get('pid')==int(j['i'])):
						total=int(total)-int(d[str(i)]['q'])*int(d[str(i)]['pri'])
						d.pop(str(i))
						session['count']=int(session['count'])-1
						if(session['count']==0):
							session['number']=0
						break
			session['cart']=d
			session['total']=total
			return jsonify({'products':d,'totals':total,'count':session['count']})	

@cartorder.route('/add_menu_cart/',methods=['POST'])
def add_menu_cart():
				d=session['cart']
				total=session['total']
				j=request.get_json()
				y=0
				if session['number']==0:
					r=query_db('select p_name,p_price from products where p_id=%s',[int(j['i'])])
					if r:
						dr={}
						for i in r:
							dr['pri']=i[1]
							dr['nam']=i[0]
						dr['q']=j['q']
						dr['pid']=int(j['i'])
						total=int(j['q'])*dr['pri']
						d['1']=dr
						session['number']=1
						session['total']=total
						session['count']=int(session['count'])+1
						y=1
				else:
					for i in range(1,session['number']+1):
						if(d.get(str(i))):
							if(d.get(str(i)).get('pid')==int(j['i'])):
								y=1
								d[str(i)]['q']=int(d[str(i)]['q'])+int(j['q'])
								total=int(total)+int(j['q'])*int(d[str(i)]['pri'])
								break
				if(y==0):
					r=query_db('select p_name,p_price from products where p_id=%s',[int(j['i'])])
					if r:
						dr={}
						for i in r:
							dr['pri']=i[1]
							dr['nam']=i[0]
						dr['q']=j['q']
						dr['pid']=int(j['i'])
						total=int(total)+int(j['q'])*int(dr['pri'])
						session['number']=int(session['number'])+1
						d[str(session['number'])]=dr
						session['count']=int(session['count'])+1
				session['cart']=d
				session['total']=total
				return jsonify({'products':d,'totals':total,'count':session['count']})
@cartorder.route('/order_checkout_billing/<delivered>/',methods=['POST'])
@cartorder.route('/order_checkout_billing/',methods=['POST'])
def checkout(delivered=None):
	if delivered:
		try:
			j=request.get_json()
			r=get_db()
			rr=r.cursor()
			rr.execute('update rest_order_history set d_status=%s where ro_id=%s',[1,int(j['roid'])])
			r.commit()
			return jsonify({'s':'1'})
		except:
			return jsonify({'s':'0'})
	g.count=session['count']
	g.cart=session['cart_addr']
	if 'user' in session and session['type']=='gen':
		return render_template('order_checkout_billing.html',logji='no')
	try:
		eml=request.form['checkout_email']
		if eml:
			session['ord_eml']=eml
			return render_template('order_checkout_billing.html',logji='no')
	except:
		return render_template('order_checkout_billing.html',logji='yes')
@cartorder.route('/check_login_billing/',methods=['POST'])
def check_login_billing():
			j=request.get_json()
			r=query_db("select password from r_users where email= %s ",[str(j['e'])])
			d=r.fetchone()
			if(d is None):
				return jsonify({"s":"0"})
			else:
				if(check_password_hash(d[0],j['p'])):
					session['user']=str(j['e'])
					session['type']='gen'
					return jsonify({"s":"1"})
				else:
					return jsonify({"s":"2"})

