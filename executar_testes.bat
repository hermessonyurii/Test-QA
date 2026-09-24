@echo off
chcp 65001 > nul
echo ========================================================
echo   Executando Testes Automatizados - SGBr / SG Master
echo ========================================================
echo.
cd /d "C:\projetos\Test-QA"
call npx cypress run --spec "cypress/e2e/login_sgbr.cy.js"
echo.
echo ========================================================
echo   Testes finalizados! Abrindo o relatorio HTML...
echo ========================================================
start "" "cypress\reports\index.html"
pause
