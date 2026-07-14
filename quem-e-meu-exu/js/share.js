export function buildShareText(result, route = "quem-e-meu-exu/") {
    return `Meu arquétipo predominante foi ${result.exu.name} e minha expressão de Pombagira foi ${result.pombagira.name}. Fiz a leitura simbólica Quem é Meu Exu? no Templo Aurora Negra. ${route}`;
}

export async function shareResult(result, route = window.location.href) {
    const text = buildShareText(result, route);
    if (navigator.share) {
        await navigator.share({ title: "Quem é Meu Exu?", text, url: route });
        return "shared";
    }
    await navigator.clipboard.writeText(text);
    return "copied";
}
