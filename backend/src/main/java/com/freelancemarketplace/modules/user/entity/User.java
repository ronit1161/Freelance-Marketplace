package com.freelancemarketplace.modules.user.entity;

import com.freelancemarketplace.common.entity.BaseEntity;
import com.freelancemarketplace.enums.UserRoles;
import com.freelancemarketplace.modules.wallet.entity.Wallet;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// user entities referencing freelancers, admins or clients in the marketplace
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "users")
@AttributeOverride(name = "id", column = @Column(name = "user_id"))
public class User extends BaseEntity {

	@Column(name = "user_name", length = 100, nullable = false, unique = true)
	private String userName;

	@Column(length = 100, nullable = false, unique = true)
	private String email;

	@Column(name = "password", length = 255, nullable = false)
	private String hashedPassword;

	@Column(name = "full_name", length = 100, nullable = false)
	private String fullName;

    @Column(name = "profile_avatar_url")
    private String profileAvatarURL;

    @Enumerated(EnumType.STRING)
    private UserRoles role;

    @Column(name = "bio_data")
    private String bioData;

    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

    @Column(name = "skills")
    private String skills;

    @Column(name = "experience")
    private Integer experience;

	@Column(name = "is_blocked")
	private boolean isBlocked = false;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "wallet_id", unique = true, nullable = false)
    private Wallet wallet;
}