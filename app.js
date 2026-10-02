const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const money=n=>new Intl.NumberFormat('vi-VN').format(Math.round(n||0))+'đ';
const today=()=>new Date().toISOString().slice(0,10);
const monthKey=d=>d.slice(0,7);
const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

const seedProducts=[
{id:'p1',name:'Cà phê đen',price:25000,cat:'Cà phê',img:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600'},
{id:'p2',name:'Cà phê sữa',price:28000,cat:'Cà phê',img:'https://images.unsplash.com/photo-1461023058943-07cb9f0d2f2a?w=600'},
{id:'p3',name:'Americano',price:30000,cat:'Cà phê',img:'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600'},
{id:'p4',name:'Latte',price:35000,cat:'Cà phê',img:'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=600'},
{id:'p5',name:'Cappuccino',price:35000,cat:'Cà phê',img:'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600'},
{id:'p6',name:'Cold Brew',price:35000,cat:'Cà phê',img:'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600'},
{id:'p7',name:'Bạc xỉu',price:32000,cat:'Cà phê',img:'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600'},
{id:'p8',name:'Matcha Latte',price:40000,cat:'Matcha',img:'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600'},
{id:'p9',name:'Trà đào',price:35000,cat:'Trà',img:'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600'},
{id:'p10',name:'Trà vải',price:35000,cat:'Trà',img:'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600'},
{id:'p11',name:'Trà ô long',price:30000,cat:'Trà',img:'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600'},
{id:'p12',name:'Chocolate',price:35000,cat:'Đá xay',img:'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600'},
{id:'p13',name:'Đá xay socola',price:45000,cat:'Đá xay',img:'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600'},
{id:'p14',name:'Đá xay matcha',price:45000,cat:'Đá xay',img:'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600'}
];
const seedToppings=[
{id:'t1',name:'Trân châu đen',price:7000,img:''},{id:'t2',name:'Thạch cà phê',price:7000,img:''},{id:'t3',name:'Kem cheese',price:10000,img:''},{id:'t4',name:'Shot espresso',price:12000,img:''}
];
const seedUsers=[
{id:'u1',user:'admin',pass:'admin123',name:'Admin',role:'admin',manager:true},
{id:'u2',user:'nhanvien',pass:'123456',name:'Đạt',role:'staff',manager:false},
{id:'u3',user:'barista01',pass:'123456',name:'Barista 01',role:'staff',manager:false}
];

if(!localStorage.getItem('mindset_products'))write('mindset_products',seedProducts);
if(!localStorage.getItem('mindset_toppings'))write('mindset_toppings',seedToppings);
if(!localStorage.getItem('mindset_users'))write('mindset_users',seedUsers);
if(!localStorage.getItem('mindset_orders'))write('mindset_orders',[]);
if(!localStorage.getItem('mindset_shifts'))write('mindset_shifts',[]);

let products=read('mindset_products',seedProducts), toppings=read('mindset_toppings',seedToppings), users=read('mindset_users',seedUsers);
let orders=read('mindset_orders',[]), shifts=read('mindset_shifts',[]);
let currentUser=read('mindset_session',null), cart=[], payMethod='cash', activeCat='Tất cả', menuTab='products';

function toast(msg){let e=$('#toast');e.textContent=msg;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2200)}
function saveAll(){write('mindset_products',products);write('mindset_toppings',toppings);write('mindset_users',users);write('mindset_orders',orders);write('mindset_shifts',shifts)}
function isAdmin(){return currentUser?.role==='admin'}
function setText(id,v){let e=$('#'+id);if(e)e.textContent=v}
function fmtDateTime(s){return new Date(s).toLocaleString('vi-VN',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit'})}

function start(){
  if(currentUser)showApp(); else $('#loginScreen').classList.remove('hidden');
  $('#loginForm').addEventListener('submit',login);
  $('#togglePass').onclick=()=>{$('#loginPass').type=$('#loginPass').type==='password'?'text':'password'};
  $('#logout').onclick=logout;
  $('#modalClose').onclick=closeModal;
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-page]'); if(b)go(b.dataset.page);
    const l=e.target.closest('[data-page-link]'); if(l)go(l.dataset.pageLink);
  });
  setInterval(()=>setText('clock',new Date().toLocaleString('vi-VN',{weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})),1000);
}
function login(e){e.preventDefault();const u=$('#loginUser').value.trim(),p=$('#loginPass').value;const found=users.find(x=>x.user===u&&x.pass===p);if(!found){toast('Sai tài khoản hoặc mật khẩu');return}currentUser=found;write('mindset_session',found);showApp()}
function logout(){currentUser=null;localStorage.removeItem('mindset_session');$('#appScreen').classList.add('hidden');$('#loginScreen').classList.remove('hidden');$('#loginForm').reset()}
function showApp(){
  $('#loginScreen').classList.add('hidden');$('#appScreen').classList.remove('hidden');
  $('#adminNav').classList.toggle('hidden',!isAdmin());$('#staffNav').classList.toggle('hidden',isAdmin());
  $('#userBox').innerHTML=`<b>${currentUser.name}</b><span>${isAdmin()?'Administrator':'Nhân viên bán hàng'}</span>`;
  if(isAdmin()){go('dashboard')}else{go('pos');checkShiftForStaff()}
  bindCommon();
}
function bindCommon(){
  $('#addAccount')?.addEventListener('click',()=>accountModal());
  $('#addProduct')?.addEventListener('click',()=>productModal());
  $('#addTopping')?.addEventListener('click',()=>toppingModal());
  $('#saveQr')?.addEventListener('click',saveQR);
  $('#removeQr')?.addEventListener('click',()=>{localStorage.removeItem('mindset_qr');renderQR();toast('Đã xóa QR')});
  $('#clearCart')?.addEventListener('click',()=>{cart=[];renderCart()});
  $('#discount')?.addEventListener('input',renderCart);
  $$('.pay').forEach(b=>b.onclick=()=>{$$('.pay').forEach(x=>x.classList.remove('active'));b.classList.add('active');payMethod=b.dataset.pay});
  $('#checkout')?.addEventListener('click',checkout);
  $('#search')?.addEventListener('input',renderProducts);
  $('#revenueDate')?.addEventListener('change',renderRevenue);
  $('#revenueMonth')?.addEventListener('change',renderRevenue);
  $$('.tab').forEach(b=>b.onclick=()=>{menuTab=b.dataset.menuTab;$$('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderMenu()});
  renderCategories();renderProducts();renderCart();renderAccounts();renderMenu();renderQR();renderDashboard();renderRevenue();renderShifts();renderMyOrders();renderMyShift();
}
function go(page){
  $$('.page').forEach(x=>x.classList.add('hidden'));
  const target=$('#page-'+page);if(!target)return;target.classList.remove('hidden');
  $$('.nav').forEach(x=>x.classList.toggle('active',x.dataset.page===page));
  const titles={dashboard:'Tổng quan',accounts:'Quản lý tài khoản',menu:'Món & Topping',qr:'QR chuyển khoản',revenue:'Doanh thu',shifts:'Quản lý ca',pos:'POS bán hàng',myOrders:'Đơn của tôi',myShift:'Ca làm việc'};
  setText('pageTitle',titles[page]||'Mindset POS');setText('crumb',titles[page]||page);
  if(page==='dashboard')renderDashboard();if(page==='accounts')renderAccounts();if(page==='menu')renderMenu();if(page==='qr')renderQR();if(page==='revenue')renderRevenue();if(page==='shifts')renderShifts();if(page==='pos'){renderCategories();renderProducts();renderCart()}if(page==='myOrders')renderMyOrders();if(page==='myShift')renderMyShift();
}

function renderCategories(){
 const cats=['Tất cả',...new Set(products.map(p=>p.cat))];
 $('#categories').innerHTML=cats.map(c=>`<button class="cat ${activeCat===c?'active':''}" onclick="activeCat='${c}';renderCategories();renderProducts()">${c}</button>`).join('');
}
function renderProducts(){
 if(!$('#productGrid'))return;const q=($('#search')?.value||'').toLowerCase();
 const list=products.filter(p=>(activeCat==='Tất cả'||p.cat===activeCat)&&p.name.toLowerCase().includes(q));
 $('#productGrid').innerHTML=list.map(p=>`<div class="product" onclick="addToCart('${p.id}')"><img src="${p.img||placeholder(p.name)}" onerror="this.src=placeholder('${p.name}')"><div class="product-info"><div class="product-name">${p.name}</div><div class="price">${money(p.price)}</div></div></div>`).join('')||'<div class="muted">Không tìm thấy món.</div>';
}
function placeholder(t){return 'https://placehold.co/600x400/e8eeea/315f51?text='+encodeURIComponent(t)}
function addToCart(id){
 let item=cart.find(x=>x.id===id&&!x.toppings.length);if(item)item.qty++;else{const p=products.find(x=>x.id===id);cart.push({id,qty:1,toppings:[],name:p.name,price:p.price,img:p.img})}
 renderCart()
}
function renderCart(){
 if(!$('#cartItems'))return;
 $('#cartItems').innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-item"><img src="${x.img||placeholder(x.name)}"><div><strong>${x.name}</strong><small>${money(x.price)}${x.toppings.length?' • '+x.toppings.map(t=>t.name).join(', '):''}</small><div class="qty"><button onclick="changeQty(${i},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${i},1)">+</button><button class="small-btn" onclick="chooseToppings(${i})">+ topping</button></div></div><div><b>${money((x.price+x.toppings.reduce((a,t)=>a+t.price,0))*x.qty)}</b><button class="remove" onclick="removeCart(${i})">×</button></div></div>`).join(''):'<div class="muted" style="padding:30px 0;text-align:center">Chưa có món trong đơn.</div>';
 const sub=cart.reduce((s,x)=>s+(x.price+x.toppings.reduce((a,t)=>a+t.price,0))*x.qty,0),dis=Math.min(Number($('#discount')?.value||0),sub);
 setText('subtotal',money(sub));setText('total',money(sub-dis));
}
function changeQty(i,n){cart[i].qty+=n;if(cart[i].qty<=0)cart.splice(i,1);renderCart()}
function removeCart(i){cart.splice(i,1);renderCart()}
function chooseToppings(i){
 const x=cart[i];openModal(`<h2>Chọn topping</h2><p class="muted">Topping áp dụng cho ${x.name}</p>${toppings.map(t=>`<label style="display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--line)"><span><input type="checkbox" ${x.toppings.some(a=>a.id===t.id)?'checked':''} onchange="toggleTop(${i},'${t.id}',this.checked)"> ${t.name}</span><b>${money(t.price)}</b></label>`).join('')}<div class="modal-actions"><button class="primary" onclick="closeModal();renderCart()">Xong</button></div>`)
}
function toggleTop(i,id,on){const t=toppings.find(x=>x.id===id);if(on&&!cart[i].toppings.some(x=>x.id===id))cart[i].toppings.push(t);if(!on)cart[i].toppings=cart[i].toppings.filter(x=>x.id!==id)}
function checkout(){
 if(!cart.length){toast('Vui lòng chọn món');return}
 const sub=cart.reduce((s,x)=>s+(x.price+x.toppings.reduce((a,t)=>a+t.price,0))*x.qty,0),dis=Math.min(Number($('#discount').value||0),sub),total=sub-dis;
 if(payMethod==='transfer'){
   const qr=localStorage.getItem('mindset_qr');
   openModal(`<div class="qr-modal"><div class="eyebrow">CHUYỂN KHOẢN</div><h2>Quét QR để thanh toán</h2>${qr?`<img src="${qr}">`:'<div class="empty-qr">Chưa có QR. Vui lòng liên hệ quản lý.</div>'}<div class="payment-info">Số tiền cần thanh toán: <b>${money(total)}</b><br>Khách đã chuyển khoản? Nhân viên kiểm tra giao dịch trước khi xác nhận.</div><button class="primary" onclick="confirmPayment(${total})">✓ Thanh toán thành công</button></div>`)
 }else{
   openModal(`<div class="qr-modal"><div class="success-icon">💵</div><h2>Thanh toán tiền mặt</h2><div class="payment-info">Tổng tiền: <b>${money(total)}</b></div><div class="form-row"><label>Tiền khách đưa</label><input id="cashGiven" type="number" value="${total}"></div><div id="changeBox" class="payment-info">Tiền thừa: <b>${money(0)}</b></div><button class="primary" onclick="confirmCash(${total})">✓ Xác nhận thanh toán</button></div>`);
   setTimeout(()=>{$('#cashGiven')?.addEventListener('input',()=>setText('changeBox',`Tiền thừa: ${money(Math.max(0,Number($('#cashGiven').value)-total))}`))},50)
 }
}
function confirmCash(total){const given=Number($('#cashGiven').value);if(given<total){toast('Tiền khách đưa chưa đủ');return}confirmPayment(total)}
function confirmPayment(total){
 const items=cart.map(x=>({...x,toppings:x.toppings.map(t=>({id:t.id,name:t.name,price:t.price}))}));
 orders.push({id:'HD'+Date.now().toString().slice(-7),time:new Date().toISOString(),staff:currentUser.name,staffId:currentUser.id,items,total,payment:payMethod});
 saveAll();cart=[];closeModal();renderCart();renderDashboard();renderRevenue();renderMyOrders();toast('Thanh toán thành công • '+money(total))
}

function accountModal(id=null){
 const u=id?users.find(x=>x.id===id):{name:'',user:'',pass:'',role:'staff',manager:false};
 openModal(`<h2>${id?'Sửa tài khoản':'Thêm tài khoản'}</h2><div class="form-row"><label>Tên nhân viên</label><input id="fName" value="${u.name}"></div><div class="form-row"><label>Tài khoản</label><input id="fUser" value="${u.user}"></div><div class="form-row"><label>Mật khẩu</label><input id="fPass" value="${u.pass}"></div><div class="form-row"><label>Quyền</label><select id="fRole"><option value="staff" ${u.role==='staff'?'selected':''}>Nhân viên</option><option value="admin" ${u.role==='admin'?'selected':''}>Admin / Quản lý</option></select></div><div class="modal-actions"><button class="primary" onclick="saveAccount('${id||''}')">Lưu</button></div>`)
}
function saveAccount(id){
 const data={name:$('#fName').value.trim(),user:$('#fUser').value.trim(),pass:$('#fPass').value,role:$('#fRole').value,manager:$('#fRole').value==='admin'};
 if(!data.name||!data.user||!data.pass){toast('Điền đầy đủ thông tin');return}
 if(id){Object.assign(users.find(x=>x.id===id),data)}else users.push({id:uid('u'),...data});
 saveAll();closeModal();renderAccounts();toast('Đã lưu tài khoản')
}
function deleteAccount(id){if(id===currentUser.id){toast('Không thể xóa tài khoản đang đăng nhập');return}if(!confirm('Xóa tài khoản này?'))return;users=users.filter(x=>x.id!==id);saveAll();renderAccounts();toast('Đã xóa')}
function renderAccounts(){
 if(!$('#accountsTable'))return;$('#accountsTable').innerHTML=`<table><thead><tr><th>Nhân viên</th><th>Tài khoản</th><th>Quyền</th><th>Trạng thái</th><th></th></tr></thead><tbody>${users.map(u=>`<tr><td><b>${u.name}</b></td><td>${u.user}</td><td><span class="badge">${u.role==='admin'?'Admin / Quản lý':'Nhân viên'}</span></td><td>Đang hoạt động</td><td class="actions"><button class="small-btn" onclick="accountModal('${u.id}')">Sửa</button><button class="small-btn red" onclick="deleteAccount('${u.id}')">Xóa</button></td></tr>`).join('')}</tbody></table>`
}

function productModal(id=null){
 const p=id?products.find(x=>x.id===id):{name:'',price:'',cat:'Cà phê',img:''};
 openModal(`<h2>${id?'Sửa món':'Thêm món'}</h2><div class="form-row"><label>Tên món</label><input id="pName" value="${p.name}"></div><div class="form-row"><label>Giá</label><input id="pPrice" type="number" value="${p.price}"></div><div class="form-row"><label>Danh mục</label><input id="pCat" value="${p.cat}"></div><div class="form-row"><label>URL hình ảnh (hoặc dùng Upload ở mục QR / file)</label><input id="pImg" value="${p.img||''}" placeholder="https://..."></div><div class="modal-actions"><button class="primary" onclick="saveProduct('${id||''}')">Lưu</button></div>`)
}
function saveProduct(id){
 const data={name:$('#pName').value.trim(),price:Number($('#pPrice').value),cat:$('#pCat').value.trim()||'Khác',img:$('#pImg').value.trim()};
 if(!data.name||!data.price){toast('Thiếu tên hoặc giá');return}
 if(id)Object.assign(products.find(x=>x.id===id),data);else products.push({id:uid('p'),...data});
 saveAll();closeModal();renderCategories();renderProducts();renderMenu();toast('Đã lưu món')
}
function deleteProduct(id){if(!confirm('Xóa món này?'))return;products=products.filter(x=>x.id!==id);saveAll();renderMenu();renderProducts();renderCategories();toast('Đã xóa món')}
function toppingModal(id=null){
 const t=id?toppings.find(x=>x.id===id):{name:'',price:''};
 openModal(`<h2>${id?'Sửa topping':'Thêm topping'}</h2><div class="form-row"><label>Tên topping</label><input id="tName" value="${t.name}"></div><div class="form-row"><label>Giá</label><input id="tPrice" type="number" value="${t.price}"></div><div class="modal-actions"><button class="primary" onclick="saveTopping('${id||''}')">Lưu</button></div>`)
}
function saveTopping(id){const data={name:$('#tName').value.trim(),price:Number($('#tPrice').value),img:''};if(!data.name||!data.price){toast('Thiếu thông tin');return}if(id)Object.assign(toppings.find(x=>x.id===id),data);else toppings.push({id:uid('t'),...data});saveAll();closeModal();renderMenu();toast('Đã lưu topping')}
function deleteTopping(id){if(!confirm('Xóa topping?'))return;toppings=toppings.filter(x=>x.id!==id);saveAll();renderMenu();toast('Đã xóa topping')}
function renderMenu(){
 if(!$('#menuTable'))return;
 if(menuTab==='products')$('#menuTable').innerHTML=`<table><thead><tr><th>Ảnh</th><th>Món</th><th>Danh mục</th><th>Giá</th><th></th></tr></thead><tbody>${products.map(p=>`<tr><td><img src="${p.img||placeholder(p.name)}"></td><td><b>${p.name}</b></td><td>${p.cat}</td><td>${money(p.price)}</td><td><button class="small-btn" onclick="productModal('${p.id}')">Sửa</button> <button class="small-btn red" onclick="deleteProduct('${p.id}')">Xóa</button></td></tr>`).join('')}</tbody></table>`;
 else $('#menuTable').innerHTML=`<table><thead><tr><th>Topping</th><th>Giá</th><th></th></tr></thead><tbody>${toppings.map(t=>`<tr><td><b>${t.name}</b></td><td>${money(t.price)}</td><td><button class="small-btn" onclick="toppingModal('${t.id}')">Sửa</button> <button class="small-btn red" onclick="deleteTopping('${t.id}')">Xóa</button></td></tr>`).join('')}</tbody></table>`;
}
function saveQR(){
 const f=$('#qrUpload').files[0];if(!f){toast('Chọn file QR trước');return}
 const r=new FileReader();r.onload=()=>{localStorage.setItem('mindset_qr',r.result);renderQR();toast('Đã cập nhật QR chuyển khoản')};r.readAsDataURL(f)
}
function renderQR(){if(!$('#adminQr'))return;const q=localStorage.getItem('mindset_qr');$('#adminQr').innerHTML=q?`<img src="${q}">`:'<div class="empty-qr">Chưa upload QR</div>'}

function dayRevenue(d){return orders.filter(o=>o.time.slice(0,10)===d).reduce((s,o)=>s+o.total,0)}
function monthRevenue(m){return orders.filter(o=>o.time.slice(0,7)===m).reduce((s,o)=>s+o.total,0)}
function renderDashboard(){
 if(!$('#dashToday'))return;const d=today(),m=monthKey(d),open=shifts.filter(s=>!s.out).length;
 setText('dashToday',money(dayRevenue(d)));setText('dashMonth',money(monthRevenue(m)));setText('dashOrders',orders.length);setText('dashStaff',open);
 const days=[...Array(7)].map((_,i)=>{const x=new Date();x.setDate(x.getDate()-6+i);return x.toISOString().slice(0,10)}),vals=days.map(dayRevenue),max=Math.max(...vals,1);
 $('#miniChart').innerHTML=days.map((d,i)=>`<div class="bar-wrap"><div class="bar" style="height:${Math.max(4,vals[i]/max*85)}%"></div><small>${d.slice(5)}</small></div>`).join('');
 $('#recentOrders').innerHTML=orders.slice().reverse().slice(0,5).map(o=>`<div class="recent-row"><span><b>${o.id}</b> · ${o.staff}<br><small>${fmtDateTime(o.time)}</small></span><b>${money(o.total)}</b></div>`).join('')||'<p class="muted">Chưa có đơn hàng.</p>';
}
function renderRevenue(){
 if(!$('#revenueDate'))return;
 const d=$('#revenueDate').value||today();$('#revenueDate').value=d;
 const months=[...new Set([monthKey(d),...orders.map(o=>o.time.slice(0,7))])].sort().reverse();
 $('#revenueMonth').innerHTML=months.map(m=>`<option ${m===monthKey(d)?'selected':''}>${m}</option>`).join('');
 const m=$('#revenueMonth').value||monthKey(d), dayOrders=orders.filter(o=>o.time.slice(0,10)===d), monOrders=orders.filter(o=>o.time.slice(0,7)===m);
 setText('selectedDayRevenue',money(dayOrders.reduce((s,o)=>s+o.total,0)));setText('selectedMonthRevenue',money(monOrders.reduce((s,o)=>s+o.total,0)));
 setText('cashRevenue',money(monOrders.filter(o=>o.payment==='cash').reduce((s,o)=>s+o.total,0)));setText('transferRevenue',money(monOrders.filter(o=>o.payment==='transfer').reduce((s,o)=>s+o.total,0)));
 const by={};monOrders.forEach(o=>{by[o.staff]=(by[o.staff]||0)+o.total});
 $('#staffRevenueTable').innerHTML=Object.entries(by).map(([n,v])=>`<div class="recent-row"><span>${n}</span><b>${money(v)}</b></div>`).join('')||'<p class="muted">Chưa có doanh thu.</p>';
}
function renderShifts(){
 if(!$('#shiftAdminTable'))return;
 $('#shiftAdminTable').innerHTML=`<table><thead><tr><th>Nhân viên</th><th>IN</th><th>OUT</th><th>Doanh thu ca</th><th>Kết ca</th></tr></thead><tbody>${shifts.slice().reverse().map(s=>{const rev=orders.filter(o=>o.staffId===s.staffId&&new Date(o.time)>=new Date(s.in)&&(s.out?new Date(o.time)<=new Date(s.out):true)).reduce((a,o)=>a+o.total,0);return `<tr><td><b>${s.staff}</b></td><td>${fmtDateTime(s.in)}</td><td>${s.out?fmtDateTime(s.out):'<span class="badge">Đang làm</span>'}</td><td>${money(rev)}</td><td>${s.out?'<b>Đã kết ca</b>':'—'}</td></tr>`}).join('')}</tbody></table>`||'<p class="muted">Chưa có ca.</p>';
}
function currentShift(){return shifts.find(s=>s.staffId===currentUser?.id&&!s.out)}
function checkShiftForStaff(){if(currentUser&&!isAdmin()&&!currentShift())toast('Bạn chưa mở ca. Vào “Ca làm việc” để IN ca.')}
function renderMyShift(){
 if(!$('#myShiftBox')||!currentUser)return;const s=currentShift();
 $('#myShiftBox').innerHTML=s?`<div class="shift-open"><b>Ca đang làm</b><p>IN: ${fmtDateTime(s.in)}</p><button class="primary" onclick="clockOut()">OUT & Kết ca</button></div>`:`<div class="shift-open"><b>Chưa mở ca</b><p class="muted">Hãy bấm IN để bắt đầu ca.</p><button class="primary" onclick="clockIn()">IN & Bắt đầu ca</button></div>`;
 const mine=shifts.filter(x=>x.staffId===currentUser.id).slice().reverse();$('#myShiftHistory').innerHTML=mine.length?`<h3>Lịch sử ca</h3><table><thead><tr><th>IN</th><th>OUT</th><th>Doanh thu</th></tr></thead><tbody>${mine.map(s=>{const rev=orders.filter(o=>o.staffId===s.staffId&&new Date(o.time)>=new Date(s.in)&&(s.out?new Date(o.time)<=new Date(s.out):true)).reduce((a,o)=>a+o.total,0);return `<tr><td>${fmtDateTime(s.in)}</td><td>${s.out?fmtDateTime(s.out):'Đang làm'}</td><td>${money(rev)}</td></tr>`}).join('')}</tbody></table>`:'';
}
function clockIn(){if(currentShift()){toast('Bạn đang trong ca');return}shifts.push({id:uid('s'),staffId:currentUser.id,staff:currentUser.name,in:new Date().toISOString(),out:null});saveAll();renderMyShift();renderShifts();renderDashboard();toast('Đã IN ca')}
function clockOut(){const s=currentShift();if(!s)return;s.out=new Date().toISOString();saveAll();renderMyShift();renderShifts();renderDashboard();toast('Đã OUT ca và kết ca')}
function renderMyOrders(){
 if(!$('#myOrdersTable')||!currentUser)return;const mine=orders.filter(o=>o.staffId===currentUser.id).slice().reverse();
 $('#myOrdersTable').innerHTML=mine.length?`<table><thead><tr><th>Mã đơn</th><th>Thời gian</th><th>Thanh toán</th><th>Tổng</th></tr></thead><tbody>${mine.map(o=>`<tr><td><b>${o.id}</b></td><td>${fmtDateTime(o.time)}</td><td>${o.payment==='cash'?'Tiền mặt':'Chuyển khoản'}</td><td>${money(o.total)}</td></tr>`).join('')}</tbody></table>`:'<p class="muted">Bạn chưa có đơn.</p>'
}
function openModal(html){$('#modalContent').innerHTML=html;$('#modal').classList.remove('hidden')}
function closeModal(){$('#modal').classList.add('hidden')}

start();
