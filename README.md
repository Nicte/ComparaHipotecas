# 🏠 ComparaHipotecas

> Herramientas sencillas para elegir tu hipoteca con claridad

**ComparaHipotecas** es una aplicación web estática que proporciona herramientas intuitivas para analizar y comparar hipotecas. Diseñada para usuarios no técnicos, ofrece calculadoras y comparadores que ayudan a entender el coste real de las hipotecas sin complicaciones.

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-brightgreen)](https://username.github.io/ComparaHipotecas/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## ✨ Características

### 📊 **Analizador de Bonificaciones** _(Disponible)_

- **Tabla interactiva** de productos vinculados editable en tiempo real
- **Cálculo de sobrecoste** preciso (coste banco vs. externo)
- **Momento óptimo** para cancelar bonificaciones claramente marcado
- **Análisis temporal** con gráficos interactivos usando Chart.js
- **Autoguardado** en localStorage para persistencia de datos
- **Inspirado en [BoniCalc](https://p2pinv88.github.io/BoniCalc/)** con mejoras de UX

### 🔄 **Comparador de Hipotecas** _(Próximamente)_

- Comparación lado a lado de múltiples ofertas
- Análisis de TIN/TAE, comisiones y cuotas
- Cálculo de coste total por hipoteca

### 📋 **Cuadro de Amortización** _(Próximamente)_

- Generación automática de cuadros de amortización
- Simulación de cambios del Euríbor
- Análisis de amortizaciones parciales

## 🚀 Características Técnicas

- **🌐 Aplicación web estática** - Sin backend necesario
- **📱 Responsive design** - Optimizada para móvil y desktop
- **♿ Accesible** - Cumple estándares WCAG 2.1 AA
- **⚡ Rápida** - Carga optimizada y rendimiento excelente
- **🔒 Segura** - CSP implementado, sin trackers
- **🎨 Moderna** - UI limpia con Tailwind CSS y diseño minimalista
- **📈 SEO optimizada** - Meta tags, Open Graph, sitemap

## 🛠️ Instalación y Uso

### Opción 1: Servidor local

```bash
# Clona el repositorio
git clone https://github.com/username/ComparaHipotecas.git
cd ComparaHipotecas

# Ejecuta un servidor local (Python)
python3 -m http.server 8001

# O con Node.js
npx serve .

# Visita http://localhost:8001
```

### Opción 2: GitHub Pages

1. Haz fork del repositorio
2. Activa GitHub Pages en Settings → Pages
3. Selecciona la rama `main` como fuente
4. Tu sitio estará disponible en `https://tu-usuario.github.io/ComparaHipotecas/`

## 📁 Estructura del Proyecto

```
ComparaHipotecas/
├── 📄 index.html              # Página principal
├── 📄 analizador.html         # Analizador de bonificaciones
├── 📄 404.html                # Página de error 404
├── 📄 .nojekyll               # Configuración GitHub Pages
├── 📄 robots.txt              # SEO
├── 📄 site.webmanifest        # PWA manifest
│
├── 🎨 css/
│   └── style.css              # Estilos globales
│
├── ⚙️ js/
│   ├── main.js                # JavaScript principal
│   └── analizador.js          # Lógica del analizador
│
└── 🖼️ img/
    └── favicon.svg            # Favicon
```

## 🗺️ Roadmap - Próximas Mejoras

### 🎯 **Corto Plazo**

- [ ] **Reducir espacios verticales en la home page**

  - Optimizar padding y margins para mejor densidad visual
  - Mejorar proporción de contenido vs. espacio en blanco
  - Mantener legibilidad y hierarchy visual

- [ ] **Mejorar layout de la calculadora de bonificaciones**
  - Reorganizar secciones para mejor flujo de información
  - Optimizar responsive design para tablets
  - Mejorar accesibilidad y navegación por teclado

### 🏗️ **Medio Plazo**

- [ ] **Implementar Comparador de Hipotecas**

  - Interfaz para añadir múltiples ofertas hipotecarias
  - Tabla comparativa con filtros y ordenación
  - Cálculo automático de TAE y costes totales
  - Exportación de comparaciones en PDF

- [ ] **Implementar Cuadro de Amortización**
  - Generación de cuadros de amortización personalizados
  - Simulador de cambios en Euríbor
  - Calculadora de amortizaciones anticipadas
  - Gráficos de evolución del capital pendiente

### 🌟 **Largo Plazo**

- [ ] **Mejoras de UX/UI**

  - Modo oscuro
  - Animaciones y transiciones mejoradas
  - Tours guiados para nuevos usuarios

- [ ] **Características Avanzadas**

  - Alertas de cambios en Euríbor
  - Comparación con inflación
  - Calculadora de capacidad de endeudamiento
  - Histórico de tipos de interés

- [ ] **Optimizaciones Técnicas**
  - Service Worker para funcionamiento offline
  - Optimización de imágenes WebP
  - Implementación completa de PWA

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. 🍴 Haz fork del proyecto
2. 🌿 Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push a la rama (`git push origin feature/AmazingFeature`)
5. 🔄 Abre un Pull Request

### Guías de Desarrollo

- Mantén el enfoque en simplicidad y accesibilidad
- Usa semantic HTML y ARIA labels
- Sigue las convenciones de naming establecidas
- Incluye tests de accesibilidad y rendimiento
- Documenta cambios significativos

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **[BoniCalc](https://p2pinv88.github.io/BoniCalc/)** - Inspiración para el analizador de bonificaciones
- **[Chart.js](https://www.chartjs.org/)** - Gráficos interactivos
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de CSS
- **[Heroicons](https://heroicons.com/)** - Iconos SVG

---

<div align="center">

**Hecha con ❤️ por [Nicte](https://github.com/Nicte)**

[🌐 Ver Demo](https://username.github.io/ComparaHipotecas/) • [🐛 Reportar Bug](https://github.com/username/ComparaHipotecas/issues) • [💡 Sugerir Feature](https://github.com/username/ComparaHipotecas/issues)

</div>
