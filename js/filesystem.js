/* =============================
   filesystem.js
  Virtual filesystem for profile content
   ============================= */

/*
  ES: Estructura virtual: dirs (type 'dir') con children; archivos multilenguaje (type 'file').
    El nodo interno 'content' no se expone al usuario, solo sirve para el render.
  EN: Virtual structure: dirs (type 'dir') with children; multilingual files (type 'file').
    Internal 'content' nodes are not exposed to the user, only used for rendering.
*/

/**
 * @typedef {Object} FileNode
 * @property {"file"} type
 * @property {string} name
 * @property {{es: string, en: string}} content
 */

/**
 * @typedef {Object} DirNode
 * @property {"dir"} type
 * @property {string} name
 * @property {Record<string, DirNode|FileNode>} children
 */

const fileSystem = {
  type: "dir",
  name: "/",
  children: {
    profile: {
      type: "dir",
      name: "profile",
      children: {
        content: {
          type: "file",
          name: "content",
          content: {
            es: `Administrador de sistemas especializado en Microsoft 365 e infraestructura híbrida. Trabajo en modernización tecnológica, seguridad y continuidad operativa, combinando experiencia técnica con gestión de proyectos estratégicos.\n\n[es.linkedin.com/in/hermesrm](https://es.linkedin.com/in/hermesrm)\n[github.com/hermesrm](https://github.com/hermesrm)`,
            en: `Systems administrator focused on Microsoft 365 and hybrid infrastructure. I work on technology modernization, security, and operational continuity, combining technical experience with strategic project management.\n\n[es.linkedin.com/in/hermesrm](https://es.linkedin.com/in/hermesrm)\n[github.com/hermesrm](https://github.com/hermesrm)`,
          },
        },
      },
    },
    contact: {
      type: "dir",
      name: "contact",
      children: {
        content: {
          type: "file",
          name: "content",
          content: {
            es: `[contacto@herzkrom.com](mailto:contacto@herzkrom.com)`,
            en: `[contacto@herzkrom.com](mailto:contacto@herzkrom.com)`,
          },
        },
      },
    },
  },
};

export { fileSystem };
