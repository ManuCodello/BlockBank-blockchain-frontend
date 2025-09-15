# BlockBank - Un Mercado de Préstamos Descentralizado

LendFi es un protocolo de finanzas descentralizadas (DeFi) que opera en la blockchain de Ethereum. Permite a los usuarios prestar sus criptoactivos para ganar intereses, o pedir prestado contra un colateral de ETH. El protocolo está diseñado con un modelo de interés dinámico, comisiones para el dueño y un robusto sistema de liquidación para garantizar la solvencia.

Este proyecto combina un contrato inteligente autónomo (backend on-chain) con una interfaz de usuario moderna (frontend off-chain) para crear una experiencia de usuario completa y funcional.

---

## ⚙️ Arquitectura del Sistema

El proyecto sigue una arquitectura Web3 estándar:

* **Backend (On-Chain):** Un único contrato inteligente, `LendingProtocol.sol`, desplegado en una red compatible con EVM (como la red de pruebas Sepolia). Este contrato es autónomo y contiene toda la lógica del negocio.
* **Frontend (Off-Chain):** Una aplicación web construida con Next.js y React. Se comunica directamente con el contrato inteligente a través de la billetera del usuario (ej. MetaMask).
* **La Conexión:** El frontend utiliza librerías como Wagmi y Ethers.js, junto con el **ABI** y la **dirección** del contrato, para leer datos de la blockchain y proponer transacciones para que el usuario las firme.

---

## ✨ Características y Componentes de la Interfaz

La aplicación se presenta como un dashboard moderno, limpio y responsive, con un tema oscuro construido con Next.js, TypeScript y Tailwind CSS.

### 1. Encabezado Principal (Header)
* **Título:** "BlockBank" a la izquierda.
* **Navegación:** Enlaces a "Dashboard" y "Docs".
* **Conexión de Billetera:** Un botón "Connect Wallet" a la derecha, que al conectarse muestra la dirección acortada del usuario (ej. `0x123...4567`).

### 2. Estructura Principal con Pestañas
El cuerpo de la aplicación se organiza mediante un sistema de pestañas para una navegación clara entre las diferentes funcionalidades.

---

### Pestaña del `Dashboard`
La vista principal que ofrece un resumen del estado del protocolo y la posición del usuario.

* **Métricas Clave del Protocolo:**
    * `Total Liquidity`: Muestra el total de STK en la piscina.
    * `Total Borrows`: Muestra el total de STK prestados.
    * `ETH Price (in STK)`: Muestra el precio actual del colateral.
    * `Protocol Fees`: Muestra las comisiones acumuladas para el dueño.
* **Posición del Usuario (si está conectado):**
    * `My STK Balance`: El saldo de STK del usuario.
    * `My Liquidity Provided`: Cuánto STK ha depositado el usuario en la piscina.

---

### Pestaña de `Lend`
Permite a los usuarios proveer liquidez al protocolo para ganar intereses.

* **Funcionalidades:**
    * Un campo de entrada (`Input`) para especificar la cantidad de STK a depositar.
    * Dos botones de acción: `Deposit Liquidity` y `Withdraw Liquidity`.
    * Muestra claramente el saldo de STK del usuario y su liquidez actual.

---

### Pestaña de `Borrow`
Gestiona la creación y el pago de préstamos.

* **Si el usuario NO tiene un préstamo activo:**
    * Un formulario para crear un nuevo préstamo.
    * Un `Input` para ingresar la cantidad de **ETH a depositar como colateral**.
    * Un botón `Borrow STK`.
* **Si el usuario SÍ tiene un préstamo activo:**
    * Muestra los detalles del préstamo: `Collateral Deposited (ETH)`, `STK Borrowed` y `Health Factor`.
    * Un botón principal: `Repay Loan`.

---

### Pestaña de `Liquidate`
La interfaz para el mecanismo de seguridad del protocolo.

* **Funcionalidades:**
    * Un `Input` para pegar la dirección de una billetera y verificar su estado.
    * Un botón `Check Loan Health`.
    * Un área de texto para mostrar el "Health Factor" del préstamo.
    * Si el préstamo es riesgoso (Health Factor bajo), se activa un botón `Liquidate`.

---

### Pestaña de `Admin Panel`
Una sección restringida con funciones exclusivas para el dueño del contrato.

* **Herramientas Administrativas:**
    * **Mint Mock STK:** Formulario para crear tokens de prueba y enviarlos a cualquier dirección.
    * **Update ETH Price:** Formulario para cambiar el precio del colateral (simulando un oráculo).
    * **Withdraw Fees:** Muestra las comisiones acumuladas y un botón para que el dueño las retire.

---

## 🚀 Guía de Instalación y Prueba

### Requisitos Previos
* [Node.js](https://nodejs.org/) (v18 o superior)
* Una billetera de navegador como [MetaMask](https://metamask.io/)
* ETH de prueba en la red Sepolia (obtenible en un [faucet como sepoliafaucet.com](https://sepoliafaucet.com/))

### Parte 1: Configurar y Correr el Frontend
1.  **Clonar el Repositorio:**
    ```bash
    git clone [https://github.com/ManuCodello/blockchain-SavingBank.git](https://github.com/ManuCodello/blockchain-SavingBank.git)
    cd blockchain-SavingBank/BlockBank
    ```
2.  **Instalar Dependencias:**
    ```bash
    npm install
    ```
3.  **Conectar con el Backend:**
    * Abre `lib/contracts/LendingProtocol.json` y pega el **ABI**.
    * Abre `lib/contract.ts` y pega la **dirección** de tu contrato.
4.  **Iniciar la Aplicación:**
    ```bash
    npm run dev
    ```
5.  Abre tu navegador en `http://localhost:3000`.

### Parte 2: Guion de Prueba de Funcionalidades
Usa 3 cuentas diferentes en MetaMask: **Dueño**, **Ahorrador** y **Liquidador**.

1.  **Acto I: Fundación**
    * Conecta la billetera del **Dueño**.
    * Ve al "Admin Panel" y usa `Mint Mock STK` para enviar `50000` STK al **Ahorrador**.
    * Cambia a la billetera del **Ahorrador**, ve a "Lend" y deposita los `50000` STK.

2.  **Acto II: Préstamo Saludable**
    * Con la billetera del **Ahorrador**, ve a "Borrow" y deposita `1` ETH como colateral para pedir un préstamo.
    * Paga el préstamo con el botón "Repay Full Loan".

3.  **Acto III: Liquidación**
    * Vuelve a crear un préstamo.
    * Como **Dueño**, ve a "Admin Panel" y baja el precio del ETH (ej. a `1100`).
    * Ve a "Liquidate", pega la dirección del **Ahorrador** y haz clic en "Check Health".
    * Como **Dueño**, envía STK al **Liquidador**.
    * Cambia a la billetera del **Liquidador** y haz clic en "Liquidate".

4.  **Acto IV: Ganancias del Protocolo**
    * Como **Dueño**, ve a "Admin Panel" y retira las ganancias con el botón "Withdraw".
