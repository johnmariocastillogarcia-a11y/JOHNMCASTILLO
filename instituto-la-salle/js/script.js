// ---------- LOGIN: cambio de rol ----------
  const tabs = document.querySelectorAll('.tab');
  const idLabel = document.getElementById('idLabel');
  const idInput = document.getElementById('idInput');
  const roleName = document.getElementById('roleName');
  const roleConfig = {
    estudiante: {label:'Código de estudiante', placeholder:'Ej: LS-2026-0348'},
    docente: {label:'Código de docente', placeholder:'Ej: DOC-0057'},
    admin: {label:'Usuario administrativo', placeholder:'Ej: admin.secretaria'}
  };
  tabs.forEach(tab=>{
    tab.addEventListener('click', ()=>{
      tabs.forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      const role = tab.dataset.role;
      idLabel.textContent = roleConfig[role].label;
      idInput.placeholder = roleConfig[role].placeholder;
      roleName.textContent = role;
    });
  });
  document.getElementById('loginForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    document.getElementById('panel').scrollIntoView({behavior:'smooth'});
  });

  // ---------- SIDEBAR PANEL ----------
  const sideBtns = document.querySelectorAll('.side-btn');
  const panelViews = document.querySelectorAll('.panel-view');
  sideBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      sideBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.dataset.view;
      panelViews.forEach(p=>p.classList.toggle('active', p.dataset.panel===view));
    });
  });

  // ---------- NOTAS: cálculo automático de promedio ----------
  const asignaturas = [
    {nombre:'Matemáticas', c1:4.2, c2:3.8, c3:4.0},
    {nombre:'Lengua Castellana', c1:4.5, c2:4.6, c3:4.3},
    {nombre:'Ciencias Naturales', c1:3.9, c2:3.5, c3:4.1},
    {nombre:'Ciencias Sociales', c1:4.0, c2:4.2, c3:3.9},
    {nombre:'Inglés', c1:3.6, c2:3.2, c3:3.8},
    {nombre:'Tecnología e Informática', c1:4.7, c2:4.8, c3:4.9},
    {nombre:'Educación Física', c1:4.5, c2:4.5, c3:4.6},
    {nombre:'Ética y Valores', c1:4.8, c2:4.9, c3:4.7},
  ];
  const gradesBody = document.querySelector('#gradesTable tbody');

  function pillFor(nota){
    if(nota>=4.0) return '<span class="pill pill-verde">Superior</span>';
    if(nota>=3.0) return '<span class="pill pill-dorado">Aceptable</span>';
    return '<span class="pill pill-rojo">Bajo</span>';
  }

  function renderGrades(){
    gradesBody.innerHTML = '';
    asignaturas.forEach((a, i)=>{
      const def = ((a.c1 + a.c2 + a.c3) / 3);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${a.nombre}</td>
        <td><input class="grade-input mono" type="number" min="1" max="5" step="0.1" value="${a.c1.toFixed(1)}" data-idx="${i}" data-corte="c1"></td>
        <td><input class="grade-input mono" type="number" min="1" max="5" step="0.1" value="${a.c2.toFixed(1)}" data-idx="${i}" data-corte="c2"></td>
        <td><input class="grade-input mono" type="number" min="1" max="5" step="0.1" value="${a.c3.toFixed(1)}" data-idx="${i}" data-corte="c3"></td>
        <td class="mono" style="font-weight:700;">${def.toFixed(1)}</td>
        <td>${pillFor(def)}</td>`;
      gradesBody.appendChild(tr);
    });
    updateOverall();
  }

  function updateOverall(){
    const defs = asignaturas.map(a => (a.c1+a.c2+a.c3)/3);
    const prom = defs.reduce((s,v)=>s+v,0) / defs.length;
    document.getElementById('promGeneral').textContent = prom.toFixed(2);
    const estado = document.getElementById('promEstado');
    if(prom>=4.0){ estado.textContent='Superior'; estado.style.color='var(--verde-sierra-2)'; }
    else if(prom>=3.0){ estado.textContent='Aprobado'; estado.style.color='#946e00'; }
    else { estado.textContent='En riesgo'; estado.style.color='var(--rojo-alerta)'; }
  }

  gradesBody.addEventListener('input', (e)=>{
    if(!e.target.classList.contains('grade-input')) return;
    const idx = e.target.dataset.idx, corte = e.target.dataset.corte;
    let val = parseFloat(e.target.value);
    if(isNaN(val)) val = 0;
    val = Math.min(5, Math.max(1, val));
    asignaturas[idx][corte] = val;
    renderGrades();
  });
  renderGrades();

  // ---------- MATRICULAS ----------
  const matriculas = [
    {nombre:'Ana Rodríguez', grado:'5°', jornada:'Mañana', estado:'Confirmada'},
    {nombre:'Luis Martínez', grado:'9°', jornada:'Mañana', estado:'Confirmada'},
    {nombre:'Sofía Pérez', grado:'Transición', jornada:'Tarde', estado:'Pendiente'},
    {nombre:'Carlos Díaz', grado:'11°', jornada:'Mañana', estado:'Confirmada'},
    {nombre:'Valentina Torres', grado:'3°', jornada:'Tarde', estado:'Pendiente'},
    {nombre:'Andrés Gómez', grado:'7°', jornada:'Mañana', estado:'Confirmada'},
  ];
  const tbodyMatriculas = document.querySelector('#tablaMatriculas tbody');
  function renderMatriculas(){
    const grado = document.getElementById('gradoFiltro').value;
    const q = document.getElementById('buscarMatricula').value.toLowerCase();
    tbodyMatriculas.innerHTML = '';
    matriculas
      .filter(m => (!grado || m.grado===grado) && m.nombre.toLowerCase().includes(q))
      .forEach(m=>{
        const pillClass = m.estado==='Confirmada' ? 'pill-verde' : 'pill-dorado';
        tbodyMatriculas.innerHTML += `<tr><td>${m.nombre}</td><td>${m.grado}</td><td>${m.jornada}</td><td><span class="pill ${pillClass}">${m.estado}</span></td></tr>`;
      });
    if(!tbodyMatriculas.innerHTML) tbodyMatriculas.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--tinta-suave);padding:24px;">No se encontraron estudiantes con ese filtro.</td></tr>';
  }
  document.getElementById('gradoFiltro').addEventListener('change', renderMatriculas);
  document.getElementById('buscarMatricula').addEventListener('input', renderMatriculas);
  renderMatriculas();

  // ---------- DIRECTORIO DOCENTES ----------
  const docentes = [
    {nombre:'Prof. Marta Ibáñez', area:'Matemáticas', cursos:'8°, 9°, 10°'},
    {nombre:'Prof. Jorge Salcedo', area:'Ciencias', cursos:'6°, 7°'},
    {nombre:'Prof. Diana Cantillo', area:'Humanidades', cursos:'9°, 11°'},
    {nombre:'Prof. Rafael Noriega', area:'Tecnología', cursos:'Primaria y Secundaria'},
    {nombre:'Prof. Lucía Barros', area:'Ética y valores', cursos:'Todos los grados'},
  ];
  const tbodyDocentes = document.querySelector('#tablaDocentes tbody');
  function renderDocentes(){
    const area = document.getElementById('areaFiltro').value;
    tbodyDocentes.innerHTML = '';
    docentes.filter(d => !area || d.area===area).forEach(d=>{
      tbodyDocentes.innerHTML += `<tr><td>${d.nombre}</td><td>${d.area}</td><td>${d.cursos}</td></tr>`;
    });
  }
  document.getElementById('areaFiltro').addEventListener('change', renderDocentes);
  renderDocentes();
