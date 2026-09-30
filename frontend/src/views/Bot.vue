<script setup>
import { ref } from 'vue'
import Navbar from '../components/common/Navbar.vue'

const bot = ref([])
const isModalOpen = ref(false)
const erreurForm = ref("")

function openModal() {
	isModalOpen.value = true
  getPm2();
}

function closeModal() {
	isModalOpen.value = false
}

async function getPm2() {
try {
	const response = await fetch("/api/bots/getBots")
	const data = await response.json()
	bot.value = data.bots || []

  console.log(bot)
} catch (error) {
	console.log(error);
}
}

async function envoyerFormulaire(event)
{
    event.preventDefault();

    const pm2 = document.getElementById("mon-select").value;
    const nom = document.getElementById("nom-bot").value.trim();
    const image = document.getElementById("image-bot").files[0];

    if (!nom)
    {
        erreurForm.value = "Erreur dans le nom";
        return;
    }

    if (!image)
    {
        erreurForm.value = "Veuillez sélectionner une image";
        return;
    }

    const formData = new FormData();

    formData.append("processPM2", pm2);
    formData.append("nomBot", nom);
    formData.append("image", image);

    try
    {
        const response = await fetch("/api/bdd/creerBot", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.success)
        {
            window.dispatchEvent(
                new CustomEvent("notify", {
                    detail: {
                        type: "success",
                        message: "Bot ajouté avec succès !"
                    }
                })
            );
        }
        else
        {
            window.dispatchEvent(
                new CustomEvent("notify", {
                    detail: {
                        type: "error",
                        message: data.message || "Erreur lors de la création du bot"
                    }
                })
            );
        }
    }
    catch (error)
    {
        console.error(error);

        window.dispatchEvent(
            new CustomEvent("notify", {
                detail: {
                    type: "error",
                    message: "Impossible de contacter le serveur"
                }
            })
        );
    }
}
</script>

<template>
	<div class="bot-app-shell">
		<Navbar />
		<main class="bot-content">
			<div class="bot-heading">
				<div>
					<p class="eyebrow">Gestion</p>
					<h1>Bot Discord</h1>
					<p class="heading-note">Gérez vos bots et leurs processus PM2.</p>
				</div>
				<button type="button" class="add-bot-button" @click="openModal">
					<span class="plus">+</span> Ajouter un bot
				</button>
				<div v-if="isModalOpen" class="add-bot">
					<div class="modal-backdrop" @click="closeModal"></div>
					<div class="bot-modal" role="dialog" aria-modal="true" aria-labelledby="add-bot-title">
						<div class="modal-header">
							<div>
								<p class="modal-kicker">Configuration</p>
								<h2 id="add-bot-title">Ajouter un bot</h2>
							</div>
							<span class="modal-icon">◉</span>
						</div>

						<form class="bot-form" @submit.prevent="envoyerFormulaire">
							<label>
								<span>Bot</span>
								<select id="mon-select">
									<option v-for="choix in bot" :value="choix.name">{{ choix.name }}</option>
								</select>
							</label>

							<label>
								<span>Nom du bot</span>
								<input id="nom-bot" type="text" placeholder="Ex. Moderation Bot" />
							</label>

							<label>
								<span>Image</span>
								<label class="image-input">
									<span class="image-placeholder">Choisir une image</span>
									<input class="image-file" type="file" accept="image/*" />
									<span class="upload-icon">↥</span>
								</label>
							</label>

							<div class="form-actions">
								<button type="button" class="cancel-button" @click="closeModal">Annuler</button>
								<button type="submit" class="save-button">Ajouter le bot</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			<section class="bot-panel">
				<div class="panel-toolbar">
					<div>
						<h2>Vos bots</h2>
						<p>Les bots actifs sur votre serveur.</p>
					</div>
					<span class="bot-count">0 bot</span>
				</div>
				<div class="empty-state">
					<div class="empty-icon">◉</div>
					<h2>Aucun bot configuré</h2>
					<p>Ajoutez votre premier bot pour commencer à le superviser avec PM2.</p>
					<span class="empty-hint">Utilisez le bouton “Ajouter un bot” ci-dessus.</span>
				</div>
			</section>
		</main>
	</div>
</template>
<style scoped>
.bot-app-shell {
	display: flex;
	width: 100%;
	min-height: 100vh;
	color: #e8edf8;
	background: #080d16;
}

.bot-content {
	position: relative;
	flex: 1 1 auto;
	min-width: 0;
	padding: 28px;
}

.bot-heading {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: 24px;
	margin: 2px 0 24px;
}

.eyebrow,
.modal-kicker {
	margin: 0 0 7px;
	color: #71809a;
	font-size: 10px;
	letter-spacing: 0.16em;
	text-transform: uppercase;
}

h1,
h2,
p {
	margin: 0;
}

h1 {
	color: #f3f6fc;
	font-size: 24px;
	font-weight: 600;
}

.heading-note,
.panel-toolbar p,
.empty-state p {
	color: #77859b;
	font-size: 12px;
}

.heading-note {
	margin-top: 5px;
}

.add-bot {
	position: relative;
	z-index: 5;
}

.add-bot summary {
	list-style: none;
}

.add-bot summary::-webkit-details-marker {
	display: none;
}

.add-bot-button,
.save-button,
.cancel-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border: 0;
	font: inherit;
	cursor: pointer;
}

.add-bot-button {
	gap: 8px;
	min-height: 38px;
	padding: 0 15px;
	color: #fff;
	background: #6658e8;
	border-radius: 6px;
	box-shadow: 0 8px 20px rgba(78, 69, 203, 0.25);
	font-size: 12px;
	font-weight: 600;
}

.add-bot-button:hover {
	background: #7769f1;
}

.plus {
	font-size: 18px;
	font-weight: 300;
	line-height: 1;
}

.bot-panel {
	min-height: 410px;
	overflow: hidden;
	background: #0d141d;
	border: 1px solid #1d2835;
	border-radius: 8px;
}

.panel-toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 18px 20px;
	border-bottom: 1px solid #1b2735;
}

.panel-toolbar h2 {
	color: #eef3ff;
	font-size: 14px;
	font-weight: 600;
}

.panel-toolbar p {
	margin-top: 3px;
}

.bot-count {
	color: #8694a9;
	font-size: 11px;
}

.empty-state {
	display: grid;
	justify-items: center;
	align-content: center;
	min-height: 330px;
	padding: 36px 20px;
	text-align: center;
}

.empty-icon,
.modal-icon {
	display: grid;
	place-items: center;
	color: #9287ff;
	background: #24204e;
	border: 1px solid #3b347c;
}

.empty-icon {
	width: 46px;
	height: 46px;
	margin-bottom: 16px;
	border-radius: 12px;
	font-size: 19px;
}

.empty-state h2 {
	color: #e9edfa;
	font-size: 15px;
	font-weight: 600;
}

.empty-state p {
	max-width: 330px;
	margin-top: 7px;
	line-height: 1.6;
}

.empty-hint {
	margin-top: 18px;
	color: #596980;
	font-size: 10px;
}

.modal-backdrop {
	position: fixed;
	z-index: -1;
	inset: 0;
	background: rgba(2, 6, 14, 0.72);
}

.bot-modal {
	position: fixed;
	z-index: 2;
	top: 50%;
	left: 50%;
	width: min(430px, calc(100vw - 32px));
	padding: 22px;
	transform: translate(-50%, -50%);
	background: #101923;
	border: 1px solid #2a394c;
	border-radius: 9px;
	box-shadow: 0 24px 70px rgba(0, 0, 0, 0.5);
}

.modal-header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	padding-bottom: 18px;
	border-bottom: 1px solid #223043;
}

.modal-header h2 {
	color: #f1f4fc;
	font-size: 17px;
	font-weight: 600;
}

.modal-kicker {
	margin-bottom: 4px;
	color: #7787a2;
	font-size: 9px;
}

.modal-icon {
	width: 34px;
	height: 34px;
	border-radius: 8px;
	font-size: 14px;
}

.bot-form {
	display: grid;
	gap: 15px;
	padding-top: 19px;
}

.bot-form label {
	display: grid;
	gap: 6px;
	color: #a9b5c8;
	font-size: 11px;
}

.bot-form input,
.bot-form select,
.image-input {
	width: 100%;
	min-height: 38px;
	padding: 0 11px;
	color: #e8edf8;
	background: #0b121c;
	border: 1px solid #263548;
	border-radius: 5px;
	font: inherit;
	outline: none;
}

.image-file {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	opacity: 0;
}

.bot-form input::placeholder {
	color: #58677c;
}

.bot-form input:focus,
.bot-form select:focus,
.image-input:focus-within {
	border-color: #7568e9;
}

.image-input {
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: #68778c;
}

.upload-icon {
	color: #9d91ff;
	font-size: 17px;
}

.form-actions {
	display: flex;
	justify-content: flex-end;
	gap: 9px;
	padding-top: 6px;
}

.cancel-button,
.save-button {
	min-height: 35px;
	padding: 0 13px;
	border-radius: 5px;
	font-size: 11px;
	font-weight: 600;
}

.cancel-button {
	color: #9ba8ba;
	background: #182332;
	border: 1px solid #2a394c;
}

.save-button {
	color: #fff;
	background: #6658e8;
}

.save-button:hover {
	background: #7769f1;
}

@media (max-width: 900px) {
	.bot-content {
		padding: 20px 14px;
	}
}

@media (max-width: 560px) {
	.bot-heading {
		align-items: flex-start;
		flex-direction: column;
		gap: 16px;
	}

	.add-bot-button {
		width: 100%;
	}

	.add-bot {
		width: 100%;
	}

	.bot-modal {
		padding: 18px;
	}
}
</style>
