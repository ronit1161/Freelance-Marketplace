# ==============================================================================
# .NET Notification Service - Multi-Stage Dockerfile
# ==============================================================================

# Stage 1: Build .NET Web API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY NotificationApi.csproj ./
RUN dotnet restore NotificationApi.csproj

COPY . ./
RUN dotnet publish NotificationApi.csproj -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8088
EXPOSE 8088

ENTRYPOINT ["dotnet", "NotificationApi.dll"]
