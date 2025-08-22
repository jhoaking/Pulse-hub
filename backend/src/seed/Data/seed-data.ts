import * as bcrypt from 'bcrypt';
import { Priority, Status } from 'src/tasks/types/task';

interface SeedTask {
  name: string;
  description: string;
  duration: string;
  status: Status;
  priority: Priority;
  tags: string[];
  createdAt: Date;
  isCompleted: boolean;
}

interface SeedUser {
  fullName: string;
  email: string;
  password: string;
  roles: string[];
}

interface SeedData {
  users: SeedUser[];
  task: SeedTask[];
}

export const initialData: SeedData = {
  users: [
    {
      email: 'test1@goolge.com',
      fullName: 'test one',
      password: bcrypt.hashSync('Abc123', 10),
      roles: ['admin'],
    },
    {
      email: 'test2@goolge.com',
      fullName: 'test two',
      password: bcrypt.hashSync('Abc123', 10),
      roles: ['user', 'employe'],
    },
  ],
  task: [
    {
      name: 'Redactar informe mensual',
      description:
        'Preparar y enviar el informe financiero mensual al equipo directivo.',
      duration: '3h',
      status: Status.pending,
      priority: Priority.high,
      tags: ['finanzas', 'reportes'],
      createdAt: new Date(),
      isCompleted: false,
    },
    {
      name: 'Revisión de código',
      description:
        'Revisar pull requests pendientes en el repositorio principal.',
      duration: '2h',
      status: Status.pending,
      priority: Priority.medium,
      tags: ['código', 'dev'],
      createdAt: new Date(),
      isCompleted: false,
    },
    {
      name: 'Llamada con cliente',
      description: 'Reunión con el cliente para discutir avances del proyecto.',
      duration: '1h',
      status: Status.completed,
      priority: Priority.high,
      tags: ['cliente', 'reunión'],
      createdAt: new Date(),
      isCompleted: true,
    },
    {
      name: 'Actualizar documentación',
      description: 'Agregar nuevas funciones a la documentación del API.',
      duration: '2h',
      status: Status.pending,
      priority: Priority.low,
      tags: ['docs', 'api'],
      createdAt: new Date(),
      isCompleted: false,
    },
    {
      name: 'Planificación sprint',
      description: 'Organizar las tareas para el próximo sprint con el equipo.',
      duration: '1.5h',
      status: Status.completed,
      priority: Priority.medium,
      tags: ['scrum', 'equipo'],
      createdAt: new Date(),
      isCompleted: true,
    },
    {
      name: 'Respaldo de base de datos',
      description:
        'Generar un backup completo de la base de datos de producción.',
      duration: '1h',
      status: Status.completed,
      priority: Priority.high,
      tags: ['db', 'infraestructura'],
      createdAt: new Date(),
      isCompleted: true,
    },
    {
      name: 'Diseño de UI',
      description: 'Crear prototipos para la nueva pantalla de inicio.',
      duration: '4h',
      status: Status.pending,
      priority: Priority.medium,
      tags: ['ui', 'diseño'],
      createdAt: new Date(),
      isCompleted: false,
    },
    {
      name: 'Capacitación interna',
      description: 'Presentación sobre buenas prácticas de seguridad.',
      duration: '2h',
      status: Status.completed,
      priority: Priority.low,
      tags: ['seguridad', 'equipo'],
      createdAt: new Date(),
      isCompleted: true,
    },
    {
      name: 'Actualizar dependencias',
      description:
        'Revisar y actualizar librerías a sus últimas versiones estables.',
      duration: '2h',
      status: Status.pending,
      priority: Priority.medium,
      tags: ['npm', 'mantenimiento'],
      createdAt: new Date(),
      isCompleted: false,
    },
    {
      name: 'Entrega de prototipo',
      description: 'Subir el prototipo funcional al entorno de pruebas.',
      duration: '5h',
      status: Status.delayed,
      priority: Priority.high,
      tags: ['proyecto', 'testing'],
      createdAt: new Date(),
      isCompleted: false,
    },
    {
      name: 'Revisión de contratos',
      description: 'Analizar contratos con nuevos proveedores.',
      duration: '3h',
      status: Status.pending,
      priority: Priority.low,
      tags: ['legal', 'proveedores'],
      createdAt: new Date(),
      isCompleted: false,
    },
    {
      name: 'Configurar CI/CD',
      description: 'Automatizar despliegue en entorno de staging.',
      duration: '6h',
      status: Status.pending,
      priority: Priority.high,
      tags: ['devops', 'ci/cd'],
      createdAt: new Date(),
      isCompleted: false,
    },
    {
      name: 'Reunión con marketing',
      description:
        'Definir estrategias para el lanzamiento del nuevo producto.',
      duration: '2h',
      status: Status.completed,
      priority: Priority.medium,
      tags: ['marketing', 'estrategia'],
      createdAt: new Date(),
      isCompleted: true,
    },
    {
      name: 'Optimizar consultas SQL',
      description: 'Mejorar rendimiento en endpoints críticos.',
      duration: '4h',
      status: Status.delayed,
      priority: Priority.high,
      tags: ['sql', 'performance'],
      createdAt: new Date(),
      isCompleted: false,
    },
    {
      name: 'Pruebas de integración',
      description: 'Ejecutar y documentar pruebas sobre la nueva API.',
      duration: '3h',
      status: Status.pending,
      priority: Priority.medium,
      tags: ['testing', 'qa'],
      createdAt: new Date(),
      isCompleted: false,
    },
  ],
};
