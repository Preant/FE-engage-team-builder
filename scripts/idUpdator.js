import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// Fonction pour extraire le nom du fichier sans extension
function getFilenameWithoutExtension(path) {
    // Gérer le cas où path est undefined
    if (!path) return '';

    // Récupérer la dernière partie du chemin (le nom du fichier)
    const filename = path.split('/').pop();

    // Retirer l'extension
    return filename.replace(/\.[^/.]+$/, '').toLowerCase();
}

// Fonction pour ajouter un ID incrémental à chaque objet d'un tableau
function addIncrementalIds(array, startId = 1) {
    return array.map((item, index) => ({
        ...item,
        id: startId + index
    }));
}

// Fonction pour trier les objets par iconUrl sans tenir compte de l'extension
function sortByIconUrl(array) {
    return [...array].sort((a, b) => {
        const nameA = getFilenameWithoutExtension(a.iconUrl);
        const nameB = getFilenameWithoutExtension(b.iconUrl);

        // Si l'une des chaînes est le préfixe de l'autre
        if (nameA.startsWith(nameB)) {
            return nameA.length - nameB.length; // La plus courte d'abord
        }
        if (nameB.startsWith(nameA)) {
            return nameA.length - nameB.length; // La plus courte d'abord
        }

        // Sinon, tri alphabétique normal
        return nameA.localeCompare(nameB);
    });
}

// Fonction principale asynchrone
async function processJsonFile() {
    try {
        // Lecture du fichier
        const filePath = join('.', 'skills.json');
        const rawData = await readFile(filePath, 'utf8');
        const data = JSON.parse(rawData);

        // Vérification que data est bien un tableau
        if (!Array.isArray(data)) {
            throw new Error('Le contenu du fichier JSON doit être un tableau');
        }

        // Tri des données par iconUrl avec la nouvelle règle
        const sortedData = sortByIconUrl(data);

        // Ajout des IDs aux données triées
        const dataWithIds = addIncrementalIds(sortedData);

        // Sauvegarde du résultat dans un nouveau fichier
        const outputPath = join('.', 'skills_with_ids.json');
        await writeFile(
            outputPath,
            JSON.stringify(dataWithIds, null, 2),
            'utf8'
        );

        console.log(`Traitement terminé. ${dataWithIds.length} éléments ont été traités.`);
        console.log(`Tri effectué selon la propriété iconUrl (sans extension, noms courts prioritaires).`);
        console.log(`Le résultat a été sauvegardé dans : ${outputPath}`);

    } catch (error) {
        console.error('Une erreur est survenue :', error.message);
        process.exit(1);
    }
}

// Exécution de la fonction principale
processJsonFile();
