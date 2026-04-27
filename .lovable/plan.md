## Ajuste de copy no Quiz

Trocar o texto "Seis perguntas curtas" por "Cinco perguntas curtas" no subtítulo da seção do quiz na home.

### Arquivo
- `src/components/site/QuizMatch.tsx` — substituir "Seis perguntas curtas. Uma recomendação feita sob medida para o seu ambiente, estilo e rotina." por "Cinco perguntas curtas. Uma recomendação feita sob medida para o seu ambiente, estilo e rotina."

Observação: o quiz hoje tem de fato 5 etapas (`STEPS.length === 5`), então a correção alinha o texto com o comportamento real.