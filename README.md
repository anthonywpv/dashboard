# 🌦 WeatherAI Dashboard

![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)
![OpenMeteo](https://img.shields.io/badge/Data-OpenMeteo-orange)
![Cohere](https://img.shields.io/badge/AI-Cohere-purple)

> *Un panel meteorológico del clima en Ecuador.* Visualiza condiciones climáticas en tiempo real y conversa con un asistente de IA que analiza los datos meteorológicos por ti.

---

## 📸 Vista Previa

![App Screenshot](https://via.placeholder.com/800x450?text=Weather+Dashboard+Preview)

---

## 📖 Descripción

Este proyecto es un Dashboard Meteorológico interactivo desarrollado con tecnologías web modernas. A diferencia de las apps de clima tradicionales, esta aplicación integra *Inteligencia Artificial Generativa*.

El sistema no solo muestra la temperatura o el viento, sino que incluye un asistente virtual capaz de interpretar esos datos y responder preguntas contextuales como "¿Es buen momento para salir a correr?" o "¿Qué ropa me recomiendas usar hoy?" basándose en las métricas en tiempo real.

---

## ✨ Características Principales

### 🌍 Datos en Tiempo Real
* *Integración con OpenMeteo:* Obtención precisa de temperatura, velocidad del viento, códigos climáticos y geolocalización sin necesidad de API Keys para los datos del clima.

### 🤖 Asistente Meteorológico (AI Powered)
* *Chatbot Contextual:* El bot "sabe" el clima actual antes de que tú se lo digas.
* *Motor Cohere:* Utiliza modelos LLM avanzados para generar consejos útiles y naturales.
* *Rate Limiting:* Sistema de protección integrado para limitar el uso de la API de IA.

### ⚡ UI/UX Moderna
* *Diseño Responsivo:* Adaptado perfectamente a móviles y escritorio.
* *Tailwind CSS:* Estilos limpios y minimalistas.
* *Rendimiento:* Construido sobre Vite para una experiencia de usuario instantánea.

---

## 🛠 Stack Tecnológico

| Herramienta | Función |
| :--- | :--- |
| *React + TypeScript* | Biblioteca de interfaz y lógica tipada. |
| *Vite* | Entorno de desarrollo y empaquetado (Build Tool). |
| *Tailwind CSS* | Framework de estilos "Utility-First". |
| *OpenMeteo API* | Fuente de datos meteorológicos (Gratuita/Open Source). |
| *Cohere API* | Procesamiento de Lenguaje Natural (Chatbot). |

---

## 🚀 Instalación y Despliegue

### 1. Clonar el repositorio
```bash
git clone [https://github.com/anthonywpv/dashboard.git](https://github.com/anthonywpv/dashboard.git)
cd dashboard