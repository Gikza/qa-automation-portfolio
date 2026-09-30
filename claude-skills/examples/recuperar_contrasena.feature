# language: es
Característica: Recuperación de contraseña por email
  Como usuario registrado
  Quiero recuperar mi contraseña por email
  Para volver a acceder a mi cuenta

  Antecedentes:
    Dado que existe un usuario registrado con el email "ana@ejemplo.com"

  # --- Solicitud del enlace (CA1: el email debe estar registrado) ---

  @smoke @regresion
  Escenario: Restablecer la contraseña con un enlace vigente y una contraseña válida
    Cuando el usuario solicita recuperar la contraseña para "ana@ejemplo.com"
    Y abre el enlace de recuperación recibido por email
    Y define la nueva contraseña "NuevaClave1"
    Entonces la contraseña se actualiza correctamente
    Y puede iniciar sesión con "ana@ejemplo.com" y "NuevaClave1"
    Pero no puede iniciar sesión con la contraseña anterior

  @regresion
  Escenario: Solicitar recuperación con un email registrado envía el enlace
    Cuando el usuario solicita recuperar la contraseña para "ana@ejemplo.com"
    Entonces se envía un email con un enlace de recuperación a "ana@ejemplo.com"
    Y el sistema muestra un mensaje de confirmación

  @regresion
  Escenario: El email se reconoce sin distinguir mayúsculas ni espacios alrededor
    Cuando el usuario solicita recuperar la contraseña para "  ANA@Ejemplo.com  "
    Entonces se envía un email con un enlace de recuperación a "ana@ejemplo.com"

  @regresion @negativo
  Escenario: Solicitar recuperación con un email no registrado no envía el enlace
    Cuando el usuario solicita recuperar la contraseña para "nadie@ejemplo.com"
    Entonces no se envía ningún email de recuperación
    Y el sistema muestra el mismo mensaje de confirmación genérico

  @regresion @negativo
  Esquema del escenario: Solicitar recuperación con un email inválido
    Cuando el usuario solicita recuperar la contraseña para "<email>"
    Entonces el sistema informa que "<mensaje>"
    Y no se envía ningún email de recuperación

    Ejemplos:
      | email              | mensaje                        |
      |                    | el email es obligatorio        |
      | ana.ejemplo.com    | el formato del email no es válido |
      | ana@               | el formato del email no es válido |
      | ana@ejemplo        | el formato del email no es válido |
      | <script>@x.com     | el formato del email no es válido |

  # --- Vigencia del enlace (CA2: vence en 24 horas) ---

  @regresion
  Esquema del escenario: El enlace es válido dentro de las 24 horas
    Dado que el usuario solicitó recuperar la contraseña para "ana@ejemplo.com"
    Cuando abre el enlace de recuperación <tiempo> después de recibirlo
    Entonces puede definir una nueva contraseña

    Ejemplos:
      | tiempo              |
      | 1 minuto            |
      | 23 horas 59 minutos |
      | 24 horas exactas    |

  @regresion @negativo
  Esquema del escenario: El enlace vencido no permite restablecer la contraseña
    Dado que el usuario solicitó recuperar la contraseña para "ana@ejemplo.com"
    Cuando abre el enlace de recuperación <tiempo> después de recibirlo
    Entonces el sistema informa que el enlace venció
    Y le ofrece solicitar un nuevo enlace

    Ejemplos:
      | tiempo              |
      | 24 horas 1 minuto   |
      | 3 días              |

  @regresion @negativo
  Escenario: El enlace no puede reutilizarse después de cambiar la contraseña
    Dado que el usuario restableció su contraseña usando el enlace de recuperación
    Cuando vuelve a abrir el mismo enlace
    Entonces el sistema informa que el enlace ya no es válido

  @regresion @negativo
  Escenario: Solicitar un nuevo enlace invalida el anterior
    Dado que el usuario solicitó recuperar la contraseña para "ana@ejemplo.com"
    Y luego solicitó un nuevo enlace de recuperación
    Cuando abre el primer enlace recibido
    Entonces el sistema informa que el enlace ya no es válido

  @regresion @negativo
  Escenario: Un enlace alterado o inexistente es rechazado
    Cuando el usuario abre un enlace de recuperación con un token inválido
    Entonces el sistema informa que el enlace no es válido

  # --- Nueva contraseña (CA3: entre 8 y 20 caracteres) ---

  @regresion
  Esquema del escenario: Aceptar contraseñas con longitud dentro del rango
    Dado que el usuario abrió un enlace de recuperación vigente
    Cuando define la nueva contraseña "<contraseña>"
    Entonces la contraseña se actualiza correctamente

    Ejemplos:
      | contraseña           | caso                      |
      | Abcdef12             | 8 caracteres (mínimo)     |
      | Abcdef123            | 9 caracteres              |
      | Abcdefghij123456789  | 19 caracteres             |
      | Abcdefghij1234567890 | 20 caracteres (máximo)    |
      | Ñandú#Clave_2026!    | caracteres especiales     |

  @regresion @negativo
  Esquema del escenario: Rechazar contraseñas con longitud fuera del rango
    Dado que el usuario abrió un enlace de recuperación vigente
    Cuando define la nueva contraseña "<contraseña>"
    Entonces el sistema informa que la contraseña debe tener entre 8 y 20 caracteres
    Y la contraseña no se modifica

    Ejemplos:
      | contraseña            | caso                   |
      |                       | vacía                  |
      | A                     | 1 carácter             |
      | Abcdef1               | 7 caracteres           |
      | Abcdefghij12345678901 | 21 caracteres          |
      | Abcdefghij12345678901234567890 | 30 caracteres |

  @regresion @negativo
  Escenario: Rechazar contraseña compuesta solo por espacios
    Dado que el usuario abrió un enlace de recuperación vigente
    Cuando define una nueva contraseña de 10 espacios en blanco
    Entonces el sistema informa que la contraseña no es válida
    Y la contraseña no se modifica

  @regresion @negativo
  Escenario: Rechazar cuando la confirmación no coincide con la nueva contraseña
    Dado que el usuario abrió un enlace de recuperación vigente
    Cuando define la nueva contraseña "NuevaClave1" y la confirma como "NuevaClave2"
    Entonces el sistema informa que las contraseñas no coinciden
    Y la contraseña no se modifica
