@echo off
chcp 65001 > nul
echo ===================================================================
echo   Executando Testes Automatizados - SG Agenda (admin.sgagenda.com.br)
echo ===================================================================
echo.
cd /d "C:\projetos\Test-QA"
call npx cypress run --spec "cypress/e2e/sgagenda/**"
echo.
echo ===================================================================
echo   Testes SG Agenda finalizados! Abrindo o relatorio HTML...
echo ===================================================================
start "" "cypress\reports\index.html"
pause
