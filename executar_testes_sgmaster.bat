@echo off
chcp 65001 > nul
echo ===================================================================
echo   Executando Testes Automatizados - SG Master Web (auth.sgbr.com.br)
echo ===================================================================
echo.
cd /d "C:\projetos\Test-QA"
call npx cypress run --spec "cypress/e2e/sgmaster/**"
echo.
echo ===================================================================
echo   Testes SG Master finalizados! Abrindo o relatorio HTML...
echo ===================================================================
start "" "cypress\reports\index.html"
pause
