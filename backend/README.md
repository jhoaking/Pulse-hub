<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


**Pulse Hub** es una plataforma en tiempo real para equipos y empresas que permite:  
- 📊 Monitorear datos en vivo (tareas, alertas).  
- 💬 Colaborar mediante chat y tareas compartidas.  
- 🔐 Gestionar roles de usuario (admin, operador, miembro).  
- ⚡ Recibir notificaciones y actualizaciones instantáneas vía WebSockets.  

Construido con **NestJS + WebSockets (Socket.IO) + PostgreSQL + TypeORM**.  
Frontend simple con **HTML + CSS + JS**.

---

## 🛠️ Tecnologías

- [NestJS](https://nestjs.com/) (Backend + WebSockets)
- [PostgreSQL](https://www.postgresql.org/) + [TypeORM](https://typeorm.io/)
- [JWT](https://jwt.io/) + bcrypt (auth & roles)
- [Socket.IO](https://socket.io/) (comunicación en tiempo real)
- [Docker](https://www.docker.com/) (contenedores)
- pnpm (gestor de paquetes)

---

## ⚙️ Instalación y uso

### Backend
 
1. Clonar repositorio 

2. Dirigirse al directorio ```cd Backend ```

3. ejecutar pnpm i 

4. cambiar las variables de entorno .env.template a .env

5. Levantar el servidor con 

```
  docker-compose up -d
```

6. Ejecutar el servidor ```pnpm run start:dev ```

7. Ejecutar seed para levantar los 'servicios'

http://localhost:3000/seed/


### Sockets

1.  Dirigirse al directorio ```cd ws ```

1. Instalar dependencias con ```pnpm i ```

2. Ejecutar el servidor con ``` pnpm run dev```


