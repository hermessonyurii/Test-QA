@echo off
chcp 65001 > nul
echo ===================================================================
echo   Executando Todos os Testes Automatizados (SG Master + SG Agenda)
echo ===================================================================
echo.
cd /d "C:\projetos\Test-QA"
call npx cypress run
echo.
echo ===================================================================
echo   Todos os testes finalizados! Abrindo o relatorio HTML...
echo ===================================================================
start "" "cypress\reports\index.html"
pause
