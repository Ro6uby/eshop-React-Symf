<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250722132103 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE messenger_messages');
        $this->addSql('ALTER TABLE adresse_client DROP FOREIGN KEY FK_891D1BDE173B1B8');
        $this->addSql('DROP INDEX IDX_891D1BDE173B1B8 ON adresse_client');
        $this->addSql('ALTER TABLE adresse_client CHANGE adresse_complement adresse_complement VARCHAR(255) DEFAULT NULL, CHANGE id_client client_id INT NOT NULL');
        $this->addSql('ALTER TABLE adresse_client ADD CONSTRAINT FK_891D1BD19EB6921 FOREIGN KEY (client_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_891D1BD19EB6921 ON adresse_client (client_id)');
        $this->addSql('ALTER TABLE commande CHANGE id_client id_client INT DEFAULT NULL, CHANGE id_adresse_livraison id_adresse_livraison INT DEFAULT NULL');
        $this->addSql('ALTER TABLE commande_detail DROP FOREIGN KEY FK_2C528446DD7ADDD');
        $this->addSql('DROP INDEX IDX_2C528446DD7ADDD ON commande_detail');
        $this->addSql('ALTER TABLE commande_detail CHANGE id_commande id_commande INT DEFAULT NULL, CHANGE id_product product_id INT NOT NULL');
        $this->addSql('ALTER TABLE commande_detail ADD CONSTRAINT FK_2C5284464584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('CREATE INDEX IDX_2C5284464584665A ON commande_detail (product_id)');
        $this->addSql('ALTER TABLE user CHANGE roles roles JSON NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, headers LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, queue_name VARCHAR(190) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL, available_at DATETIME NOT NULL, delivered_at DATETIME DEFAULT \'NULL\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE adresse_client DROP FOREIGN KEY FK_891D1BD19EB6921');
        $this->addSql('DROP INDEX IDX_891D1BD19EB6921 ON adresse_client');
        $this->addSql('ALTER TABLE adresse_client CHANGE adresse_complement adresse_complement VARCHAR(255) DEFAULT \'NULL\', CHANGE client_id id_client INT NOT NULL');
        $this->addSql('ALTER TABLE adresse_client ADD CONSTRAINT FK_891D1BDE173B1B8 FOREIGN KEY (id_client) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_891D1BDE173B1B8 ON adresse_client (id_client)');
        $this->addSql('ALTER TABLE commande CHANGE id_client id_client INT NOT NULL, CHANGE id_adresse_livraison id_adresse_livraison INT NOT NULL');
        $this->addSql('ALTER TABLE commande_detail DROP FOREIGN KEY FK_2C5284464584665A');
        $this->addSql('DROP INDEX IDX_2C5284464584665A ON commande_detail');
        $this->addSql('ALTER TABLE commande_detail CHANGE id_commande id_commande INT NOT NULL, CHANGE product_id id_product INT NOT NULL');
        $this->addSql('ALTER TABLE commande_detail ADD CONSTRAINT FK_2C528446DD7ADDD FOREIGN KEY (id_product) REFERENCES product (id)');
        $this->addSql('CREATE INDEX IDX_2C528446DD7ADDD ON commande_detail (id_product)');
        $this->addSql('ALTER TABLE user CHANGE roles roles LONGTEXT NOT NULL COLLATE `utf8mb4_bin`');
    }
}
